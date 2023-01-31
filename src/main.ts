import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as connectRedis from 'connect-redis'
import * as session from 'express-session'
import { createClient } from 'redis'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)
  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')
  const RedisStore = connectRedis(session)
  const redisClient = createClient({
    url: config.getOrThrow<string>('REDIS_URL'),
    legacyMode: true
  })

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: new RedisStore({ client: redisClient })
    })
  )

  await redisClient.connect().catch(error => {
    throw error
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  )

  const port = config.getOrThrow<number>('PORT')

  await app.listen(port)
}
bootstrap()
