import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { JwtPayload, JwtTokenType } from './jwt-payload.interface'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email)
    if (existing) throw new ConflictException('Email déjà utilisé')
    const user = await this.usersService.create(email, password)
    return this.generateTokens(user.id, user.email, user.role)
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) throw new UnauthorizedException('Identifiants invalides')
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new UnauthorizedException('Identifiants invalides')
    return this.generateTokens(user.id, user.email, user.role)
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null)
    return { message: 'Déconnexion réussie' }
  }

  private generateTokens(userId: string, email: string, role: string) {
    const sign = (type: JwtTokenType, expiresIn: '15m' | '7d') => {
      const payload: JwtPayload = { sub: userId, email, role, type }
      return this.jwtService.sign(payload, { expiresIn })
    }
    return { accessToken: sign('access', '15m'), refreshToken: sign('refresh', '7d') }
  }
}