import { Body, Controller, Post, Session } from '@nestjs/common'

import { AuthService } from './auth.service'
import { PublicRoute } from './decorator'
import { AuthDto } from './dto'
import { UserEntity } from './entity'
import { UserSession, UserSessionData } from './types'

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('signup')
  async signup(
    @Body() authDto: AuthDto,
    @Session() session: UserSession
  ): Promise<UserEntity> {
    const { id, email, role } = await this.authSerivce.signup(authDto)

    this.serializeSession({ id, email, role }, session)

    return new UserEntity({ id, email, role })
  }

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Session() session: UserSession
  ): Promise<UserEntity> {
    const { id, email, role } = await this.authSerivce.login(authDto)

    this.serializeSession({ id, email, role }, session)

    return new UserEntity({ id, email, role })
  }

  private serializeSession(
    userData: UserSessionData,
    session: UserSession
  ): void {
    session.user = { ...userData }
  }
}
