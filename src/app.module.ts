import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from '~/auth'
import { PrismaModule } from '~/prisma'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    PrismaModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
