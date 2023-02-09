import { Injectable, UnauthorizedException } from '@nestjs/common'
import type { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup({ email, password }: AuthDto): Promise<User> {
    try {
      const hash = await argon.hash(password)
      const newUser = await this.prisma.user.create({
        data: { email, hash }
      })

      return newUser
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnauthorizedException('Invalid Credentials.', {
          cause: new Error('Unique Constraint.'),
          description: 'Cannot Create User.'
        })
      }

      throw error
    }
  }

  async login({ email, password }: AuthDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials.', {
        cause: new Error('Unique Constraint.'),
        description: 'Cannot Authenticate User.'
      })
    }

    const passwordMatches = await argon.verify(user.hash, password)

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid Credentials.', {
        cause: new Error('Unique Constraint.'),
        description: 'Cannot Authenticate User.'
      })
    }

    return user
  }
}
