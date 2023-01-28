import { Controller, Post } from '@nestjs/common'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  signup() {
    return this.authSerivce.signup()
  }

  @Post('login')
  login() {
    return this.authSerivce.login()
  }
}
