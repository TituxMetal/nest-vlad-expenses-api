import { Body, Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { UserEntity } from './entity'

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  signup(@Body() authDto: AuthDto): Promise<UserEntity> {
    return this.authSerivce.signup(authDto)
  }

  @Post('login')
  login(@Body() authDto: AuthDto): Promise<UserEntity> {
    return this.authSerivce.login(authDto)
  }
}
