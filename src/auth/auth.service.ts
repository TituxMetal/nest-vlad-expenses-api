import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { AuthDto } from './dto'
import { UserEntity } from './entity'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup({ email, password }: AuthDto): Promise<UserEntity> {
    try {
      const hash = await argon.hash(password)
      const newUser = await this.prisma.user.create({
        data: { email, hash }
      })

      return new UserEntity(newUser)
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

  async login({ email, password }: AuthDto): Promise<UserEntity> {
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

    return new UserEntity(user)
  }
}
