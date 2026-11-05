import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { SocketIoAdapter } from './pipeline/socket-io.adapter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  app.useWebSocketAdapter(
    new SocketIoAdapter(app, app.get(ConfigService).get<string>('FRONTEND_URL')),
  )

  const config = new DocumentBuilder()
    .setTitle('CRM Immo API')
    .setDescription('API de gestion de biens immobiliers et contacts')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3001)
}
bootstrap()