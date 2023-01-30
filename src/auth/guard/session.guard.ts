import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { Observable } from 'rxjs'

import { IS_PUBLIC_ROUTE } from '../decorator'
import type { UserSession } from '../types'

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublicRoute = this.reflector.getAllAndOverride<string>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()]
    )

    if (isPublicRoute) {
      return true
    }

    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    if (!session.user) {
      throw new UnauthorizedException('Session not provided')
    }

    return true
  }
}
