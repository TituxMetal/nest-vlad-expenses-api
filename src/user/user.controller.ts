import { Controller, Get } from '@nestjs/common'

import { UserEntity, GetUserId } from '~/auth'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUserId() userId: string): Promise<UserEntity> {
    return this.userService.getMe(userId)
  }
}
