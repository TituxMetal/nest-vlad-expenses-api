import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { AuthDto } from './dto'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup({ email, password }: AuthDto) {
    try {
      const hash = await argon.hash(password)
      const newUser = await this.prisma.user.create({
        data: { email, hash }
      })

      return { id: newUser.id, email: newUser.email }
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

  login() {
    const message = { message: 'Login method' }
    console.log(message)

    return message
  }
}
