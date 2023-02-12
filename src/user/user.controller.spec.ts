import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'

import { UserEntity } from '~/auth'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  const userId = 'userid123'
  const userEntity = new UserEntity({
    id: userId,
    email: 'test@test.com',
    role: Role.USER
  })
  const userServiceMock = jest.fn().mockReturnValue({
    getMe: jest.fn().mockResolvedValue(userEntity),
    getAll: jest.fn().mockResolvedValue([userEntity])
  })

  let controller: UserController
  let result

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: userServiceMock }]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getMe()', () => {
    describe('when called', () => {
      it('should return logged in user info', async () => {
        result = await controller.getMe(userId)

        expect(result).toEqual(userEntity)
      })
    })
  })

  describe('getAll()', () => {
    describe('when called', () => {
      it('should return all users', async () => {
        result = await controller.getAll()

        expect(result).toEqual([userEntity])
      })
    })
  })
})
