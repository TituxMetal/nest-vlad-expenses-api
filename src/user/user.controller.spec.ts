import { Test } from '@nestjs/testing'

import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('UserController', () => {
  const userServiceMock = jest.fn()

  let controller: UserController

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useFactory: userServiceMock }]
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
