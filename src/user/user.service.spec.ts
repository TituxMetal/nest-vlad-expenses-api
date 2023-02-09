import { Test } from '@nestjs/testing'
import { User } from '@prisma/client'

import { UserStub, UserStubWithCount } from '~/common/test/stubs'
import { PrismaService } from '~/prisma'

import { UserService } from './user.service'

describe('UserService', () => {
  const prismaServiceUserMock = jest.fn().mockReturnValue({
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn()
    }
  })

  let service: UserService
  let prisma: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useFactory: prismaServiceUserMock
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
      const userIdParam = UserStub().id

      let result: User

      it('should return user', async () => {
        const _user = UserStub()
        const prismaFindUniqueMock = jest
          .spyOn(prisma.user, 'findUnique')
          .mockResolvedValue(_user)

        result = await service.getMe(userIdParam)

        expect(prismaFindUniqueMock).toHaveBeenCalledTimes(1)
        expect(result).toEqual(_user)
      })
    })
  })

  describe('getAll()', () => {
    describe('when called', () => {
      let result: User[]

      it('should return users array', async () => {
        const _users = [UserStubWithCount()]
        const prismaUserFindManyMock = jest
          .spyOn(prisma.user, 'findMany')
          .mockResolvedValue(_users)

        result = await service.getAll()

        expect(prismaUserFindManyMock).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject(_users)
      })
    })
  })
})
