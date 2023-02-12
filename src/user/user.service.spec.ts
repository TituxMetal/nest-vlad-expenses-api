import { Test } from '@nestjs/testing'
import { Role, User } from '@prisma/client'

import { UserEntity } from '~/auth'
import { PrismaService } from '~/prisma'

import { UserService } from './user.service'

describe('UserService', () => {
  const userId = 'userid123'
  const userEntity = new UserEntity({
    id: userId,
    email: 'test@test.com',
    role: Role.USER
  })
  const user = { ...userEntity } as User
  const prismaServiceMock = jest.fn().mockReturnValue({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  })

  let service: UserService
  let prisma: PrismaService
  let result

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
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getMe()', () => {
    describe('when called', () => {
      it('should return user info and matching user id', async () => {
        const userFindUniqueSpy = jest
          .spyOn(prisma.user, 'findUnique')
          .mockResolvedValue(user)

        result = await service.getMe(userId)

        expect(userFindUniqueSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual(userEntity)
        expect(result.id).toEqual(userId)
      })
    })
  })

  describe('getAll()', () => {
    describe('when called', () => {
      it('should return array of users', async () => {
        const userFindManySpy = jest
          .spyOn(prisma.user, 'findMany')
          .mockResolvedValue([user])

        result = await service.getAll()

        expect(result).toEqual([user])
        expect(userFindManySpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
