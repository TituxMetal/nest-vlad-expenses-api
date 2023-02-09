import { Test } from '@nestjs/testing'

import { PrismaService } from '~/prisma'

import { UserService } from './user.service'

describe('UserService', () => {
  const prismaServiceMock = jest.fn()

  let service: UserService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useFactory: prismaServiceMock
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
