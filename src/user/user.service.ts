import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { UserEntity } from '~/auth'
import { PrismaService } from '~/prisma'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    return new UserEntity(user)
  }

  async getAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: { _count: { select: { expenses: true } } }
    })

    return users
  }
}
