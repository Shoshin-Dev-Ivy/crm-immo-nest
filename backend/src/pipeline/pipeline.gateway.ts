// pipeline/pipeline.gateway.ts
import { Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { DecodedJwtPayload } from '../auth/jwt-payload.interface'
import { DealStageChangedEvent } from './events/deal-stage-changed.event'

@WebSocketGateway()
export class PipelineGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(PipelineGateway.name)

  @WebSocketServer()
  private server!: Server

  constructor(private readonly jwtService: JwtService) {}

  // Authentification au handshake : la connexion est refusée avant d'être établie.
  afterInit(server: Server) {
    server.use(async (client, next) => {
      try {
        const token = client.handshake.auth?.token
        if (typeof token !== 'string' || token.length === 0) throw new Error('Missing token')
        const payload = await this.jwtService.verifyAsync<DecodedJwtPayload>(token)
        if (payload.type !== 'access') throw new Error('Invalid token type')
        client.data.user = payload
        next()
      } catch {
        next(new Error('Unauthorized'))
      }
    })
  }

  // Option B : le socket ne survit pas à l'expiration du token.
  handleConnection(client: Socket) {
    const { sub, exp } = client.data.user as DecodedJwtPayload
    const delay = Math.max(exp * 1000 - Date.now(), 0)
    client.data.expiryTimer = setTimeout(() => {
      client.emit('auth:expired')
      client.disconnect(true)
    }, delay)
    this.logger.log(`Client ${client.id} connected (user ${sub})`)
  }

  handleDisconnect(client: Socket) {
    clearTimeout(client.data.expiryTimer)
  }

  @OnEvent('deal.stage_changed')
  handleDealStageChanged(event: DealStageChangedEvent) {
    this.server.emit('deal.stage_changed', {
      dealId: event.dealId,
      fromStage: event.fromStage,
      toStage: event.toStage,
      changedById: event.userId,
    })
  }
}