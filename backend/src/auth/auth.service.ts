import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
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

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null)
    return { message: 'Déconnexion réussie' }
  }

  private generateTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role }
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' })
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' })
    return { accessToken, refreshToken }
  }
}