import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import * as redisStore from 'cache-manager-redis-store'
import { RedisClientOptions } from 'redis'

import { AuthModule, SessionGuard, TransformInterceptor } from '~/auth'
import { ExpenseModule } from '~/expense'
import { PrismaModule } from '~/prisma'
import { UserModule } from '~/user'

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
    AuthModule,
    PrismaModule,
    UserModule,
    ExpenseModule
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: SessionGuard }
  ]
})
export class AppModule {}
