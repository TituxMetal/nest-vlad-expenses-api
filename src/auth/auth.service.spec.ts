import { UnauthorizedException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Role, User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'

import { PrismaService } from '~/prisma'

import { AuthService } from './auth.service'
import { AuthDto } from './dto'

jest.mock('argon2')

const _user = {
  id: 'abc123',
  email: 'test@test.com',
  hash: 'hashedPaswword',
  role: Role.USER
} as User
const _authDto: AuthDto = {
  email: 'test@test.com',
  password: 'password'
}

describe('AuthService', () => {
  const prismaServiceUserMock = jest.fn().mockReturnValue({
    user: {
      create: jest.fn().mockResolvedValue(_user),
      findUnique: jest.fn().mockResolvedValue(_user)
    }
  })

  let service: AuthService
  let prisma: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useFactory: prismaServiceUserMock }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signup()', () => {
    describe('when called', () => {
      let result
      let prismaUserCreateSpy
      let argonSpy

      beforeEach(async () => {
        prismaUserCreateSpy = jest
          .spyOn(prisma.user, 'create')
          .mockResolvedValue(_user)
        argonSpy = jest.spyOn(argon, 'hash').mockResolvedValue('hashedPaswword')
      })

      it('should return created user', async () => {
        result = await service.signup(_authDto)

        expect(result).toEqual(_user)
        expect(prismaUserCreateSpy).toHaveBeenCalledTimes(1)
      })

      it('not should return user plain password', async () => {
        result = await service.signup(_authDto)

        expect(result.hash).not.toEqual(_authDto.password)
        expect(argonSpy).toHaveBeenCalledTimes(1)
        expect(argonSpy).toHaveBeenCalledWith(_authDto.password)
      })

      it('should throw if user already exists', async () => {
        prismaUserCreateSpy = jest
          .spyOn(prisma.user, 'create')
          .mockRejectedValueOnce(
            new PrismaClientKnownRequestError('Unique Constraint', {
              code: 'P2002',
              clientVersion: ''
            })
          )

        await service.signup(_authDto).catch((error: UnauthorizedException) => {
          expect(prismaUserCreateSpy).toHaveBeenCalledTimes(1)
          expect(error).toBeInstanceOf(UnauthorizedException)
          expect(error.message).toEqual('Invalid Credentials.')
        })
      })
    })
  })

  describe('login()', () => {
    describe('when called', () => {
      let result
      let prismaUserFindUniqueSpy
      let argonSpy

      beforeEach(async () => {
        prismaUserFindUniqueSpy = jest
          .spyOn(prisma.user, 'findUnique')
          .mockResolvedValue(_user)
        argonSpy = jest.spyOn(argon, 'verify').mockResolvedValue(true)
      })

      it('should return authenticated user', async () => {
        result = await service.login(_authDto)

        expect(result).toEqual(_user)
        expect(prismaUserFindUniqueSpy).toHaveBeenCalledTimes(1)
      })

      it('should not return user plain password', async () => {
        result = await service.login(_authDto)

        expect(result.hash).not.toEqual(_authDto.password)
      })

      it('should throw if invalid email', async () => {
        prismaUserFindUniqueSpy = jest
          .spyOn(prisma.user, 'findUnique')
          .mockResolvedValueOnce(null)

        await service.login(_authDto).catch((error: UnauthorizedException) => {
          expect(error).toBeInstanceOf(UnauthorizedException)
          expect(error.message).toEqual('Invalid Credentials.')
          expect(prismaUserFindUniqueSpy).toHaveBeenCalledTimes(1)
        })
      })

      it('should throw if not matching password', async () => {
        argonSpy = jest.spyOn(argon, 'verify').mockResolvedValue(false)

        await service.login(_authDto).catch((error: UnauthorizedException) => {
          expect(argonSpy).toHaveBeenCalledTimes(1)
          expect(error).toBeInstanceOf(UnauthorizedException)
          expect(error.message).toEqual('Invalid Credentials.')
        })
      })
    })
  })
})
