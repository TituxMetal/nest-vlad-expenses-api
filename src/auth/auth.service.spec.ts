import { Test } from '@nestjs/testing'

import { PrismaService } from '~/prisma'

import { AuthService } from './auth.service'

describe('AuthService', () => {
  const prismaServiceMock = jest.fn()
  let service: AuthService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useFactory: prismaServiceMock }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
