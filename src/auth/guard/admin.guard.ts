import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from '@prisma/client'
import { Request } from 'express'
import { Observable } from 'rxjs'

import { IS_ADMIN_ROUTE } from '../decorator'
import type { UserSession } from '../types'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdminRoute = this.reflector.getAllAndOverride<string>(
      IS_ADMIN_ROUTE,
      [context.getHandler(), context.getClass()]
    )

    if (!isAdminRoute) {
      return true
    }

    const request = context.switchToHttp().getRequest() as Request
    const session = request.session as UserSession

    if (session.user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Only for Admin users.')
    }

    return true
  }
}
