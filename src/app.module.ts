import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import * as redisStore from 'cache-manager-redis-store'
import { RedisClientOptions } from 'redis'

import {
  AdminGuard,
  AuthModule,
  SessionGuard,
  TransformInterceptor
} from '~/auth'
import { ExpenseModule } from '~/expense'
import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

import { SchedulerModule } from './scheduler'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        url: config.getOrThrow('REDIS_URL')
      })
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    UserModule,
    ExpenseModule,
    SchedulerModule
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: SessionGuard },
    { provide: APP_GUARD, useClass: AdminGuard }
  ]
})
export class AppModule {}
