import { Controller, Get } from '@nestjs/common'

import { UserEntity, GetUserId, AdminRoute } from '~/auth'

import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@GetUserId() userId: string): Promise<UserEntity> {
    const user = await this.userService.getMe(userId)

    return new UserEntity(user)
  }

  @AdminRoute()
  @Get()
  async getAll(): Promise<UserEntity[]> {
    const users = await this.userService.getAll()

    return users.map(user => new UserEntity(user))
  }
}
