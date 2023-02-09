import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'

import { PrismaService } from '~/prisma'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getMe(userId: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } })
  }

  getAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { _count: { select: { expenses: true } } }
    })
  }
}
