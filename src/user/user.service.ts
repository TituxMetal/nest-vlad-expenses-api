import { Injectable } from '@nestjs/common'

import { UserEntity } from '~/auth'
import { PrismaService } from '~/prisma'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    return new UserEntity(user)
  }
}
