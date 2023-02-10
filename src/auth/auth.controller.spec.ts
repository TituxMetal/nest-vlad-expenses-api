import { Test } from '@nestjs/testing'
import { Role } from '@prisma/client'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthDto } from './dto'
import { UserEntity } from './entity'
import { UserSession } from './types'

const _userEntity = new UserEntity({
  id: 'abc123',
  email: 'test@test.com',
  role: Role.USER
})
const _authDto: AuthDto = {
  email: 'test@test.com',
  password: 'password'
}

describe('AuthController', () => {
  const authServiceMock = jest.fn().mockReturnValue({
    signup: jest.fn().mockResolvedValue(_userEntity),
    login: jest.fn().mockResolvedValue(_userEntity)
  })

  let controller: AuthController
  let result
  let session

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: authServiceMock }]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('signup()', () => {
    beforeEach(async () => {
      session = { user: undefined } as UserSession
      result = await controller.signup(_authDto, session)
    })

    describe('when called', () => {
      it('should return the created user', async () => {
        expect(result).toEqual(_userEntity)
      })

      it('should add user info in the session', async () => {
        expect(session.user).toBeDefined()
        expect(session).toEqual({ user: _userEntity })
      })
    })
  })

  describe('login()', () => {
    beforeEach(async () => {
      session = { user: undefined } as UserSession
      result = await controller.login(_authDto, session)
    })

    describe('when called', () => {
      it('should return the logged in user', async () => {
        expect(result).toEqual(_userEntity)
      })

      it('should add user info in the session', async () => {
        expect(session.user).toBeDefined()
        expect(session).toEqual({ user: _userEntity })
      })
    })
  })
})
