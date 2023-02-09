import { Test } from '@nestjs/testing'

import { UserStub, UserStubWithCount } from '~/common/test/stubs'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  const mockedUser = UserStub()
  const mockedUsersWithCount = [UserStubWithCount()]
  const userServiceMock = { getMe: jest.fn(), getAll: jest.fn() }

  let controller: UserController
  let service: UserService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userServiceMock }]
    }).compile()

    controller = module.get<UserController>(UserController)
    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getMe()', () => {
    it('should return a user', async () => {
      const getMeMockService = jest
        .spyOn(service, 'getMe')
        .mockResolvedValue(mockedUser)

      const result = await controller.getMe('123')

      expect(getMeMockService).toHaveBeenCalledTimes(1)
      expect(getMeMockService).toHaveBeenCalledWith('123')
      expect(result).toEqual(mockedUser)
    })
  })

  describe('getAll()', () => {
    describe('when getAll() is called', () => {
      it('should return all users', async () => {
        const getAllMockService = jest
          .spyOn(service, 'getAll')
          .mockResolvedValue(mockedUsersWithCount)

        const result = await controller.getAll()

        expect(getAllMockService).toHaveBeenCalledTimes(1)
        expect(result).toEqual(mockedUsersWithCount)
      })
    })
  })
})
