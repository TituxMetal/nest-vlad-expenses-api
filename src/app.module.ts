import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

import { AuthModule, SessionGuard, TransformInterceptor } from '~/auth'
import { PrismaModule } from '~/prisma'

import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    PrismaModule,
    UserModule
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: SessionGuard }
  ]
})
export class AppModule {}
