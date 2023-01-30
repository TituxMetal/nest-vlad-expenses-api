import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

import { UserSession } from '../types'

export const GetUserId = createParamDecorator(
  (_data: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    return session.user.id
  }
)
