import { Controller, Get } from '@nestjs/common'

import { UserEntity, GetUserId, AdminRoute } from '~/auth'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe(@GetUserId() userId: string): Promise<UserEntity> {
    return this.userService.getMe(userId)
  }

  @AdminRoute()
  @Get()
  async getAll(): Promise<UserEntity[]> {
    const users = await this.userService.getAll()

    return users.map(user => new UserEntity(user))
  }
}
