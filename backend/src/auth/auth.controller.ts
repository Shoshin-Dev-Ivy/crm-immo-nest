import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'
import { RolesGuard } from './roles.guard'
import { Roles } from './roles.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password)
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password)
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: { user: { id: number } }) {
    return this.authService.logout(req.user.id)
  }

  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  adminOnly() {
    return { message: 'Accès admin autorisé' }
  }
}