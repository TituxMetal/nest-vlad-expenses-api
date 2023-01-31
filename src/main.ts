import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import * as session from 'express-session'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = app.get(ConfigService)

  const sessionSecret = config.getOrThrow<string>('SESSION_SECRET')

  app.use(
    session({ secret: sessionSecret, resave: false, saveUninitialized: false })
  )
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  )

  const port = config.getOrThrow<number>('PORT')

  await app.listen(port)
}
bootstrap()
