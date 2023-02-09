import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { PaginateDto, PaginateResultType } from '~/common'
import {
  ExpenseStub,
  PaginatedExpensesStub,
  UserStub
} from '~/common/test/stubs'
import { PrismaService } from '~/prisma'

import { CreateDto, UpdateDto } from './dto'
import { ExpenseService } from './expense.service'

describe('ExpenseService', () => {
  const prismaServiceExpenseMock = jest.fn().mockReturnValue({
    expense: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  })

  let service: ExpenseService
  let prisma: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExpenseService,
        {
          provide: PrismaService,
          useFactory: prismaServiceExpenseMock
        }
      ]
    }).compile()

    service = module.get(ExpenseService)
    prisma = module.get(PrismaService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllByUserId()', () => {
    describe('when called', () => {
      const userIdParam = UserStub().id
      const paginateParams = new PaginateDto()
      const _data = new Array(ExpenseStub())

      it('should return with paginated expenses', async () => {
        const expenseFindManySpy = jest
          .spyOn(prisma.expense, 'findMany')
          .mockResolvedValue(_data)
        const expenseCountSpy = jest
          .spyOn(prisma.expense, 'count')
          .mockResolvedValue(1)

        const result: PaginateResultType = await service.getAllByUserId(
          userIdParam,
          paginateParams
        )

        expect(result).toEqual(PaginatedExpensesStub())
        expect(result.data).toEqual(_data)
        expect(expenseFindManySpy).toHaveBeenCalledTimes(1)
        expect(expenseCountSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('getUserExpenseById()', () => {
    describe('when called', () => {
      const userIdParam = UserStub().id
      const expenseIdParam = ExpenseStub().id
      const _data = ExpenseStub()

      let expenseFindFirstSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_data)
      })

      it('should return expense from provided user', async () => {
        const result = await service.getUserExpenseById(
          userIdParam,
          expenseIdParam
        )

        expect(result).toEqual(_data)
        expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
      })

      it('should throw if no expense found', async () => {
        expenseFindFirstSpy.mockResolvedValueOnce(null)

        await service
          .getUserExpenseById(userIdParam, 'fakeId')
          .catch((error: NotFoundException) => {
            expect(error).toBeInstanceOf(NotFoundException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })

      it('should throw if userId is not the same as expense.userId', async () => {
        await service
          .getUserExpenseById('fakeId', expenseIdParam)
          .catch((error: ForbiddenException) => {
            expect(error).toBeInstanceOf(ForbiddenException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })
    })
  })

  describe('create()', () => {
    describe('when called', () => {
      const now = new Date()
      const userIdParam = UserStub().id
      const createDto = {
        amount: '100',
        date: now,
        title: 'Test expense',
        description: 'Optionnal description for test expense'
      } as CreateDto
      const _data = {
        id: '1234',
        title: createDto.title,
        description: createDto.description,
        amount: createDto.amount,
        date: now,
        createdAt: now,
        updatedAt: now,
        userId: userIdParam
      }

      it('should create an expense', async () => {
        const expenseCreateSpy = jest
          .spyOn(prisma.expense, 'create')
          .mockResolvedValue(_data)

        const result = await service.create(userIdParam, createDto)

        expect(result).toEqual(_data)
        expect(expenseCreateSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('update()', () => {
    describe('when called', () => {
      const now = new Date()
      const userIdParam = ExpenseStub().userId
      const expenseIdParam = ExpenseStub().id
      const updateDto = {
        amount: '150',
        title: 'Test expense',
        description: 'Optionnal description for test expense'
      } as UpdateDto
      const _data = {
        id: expenseIdParam,
        title: updateDto.title,
        description: updateDto.description,
        amount: updateDto.amount,
        date: ExpenseStub().date,
        createdAt: ExpenseStub().createdAt,
        updatedAt: now,
        userId: userIdParam
      }
      const _expenseData = ExpenseStub()

      let expenseFindFirstSpy
      let expenseUpdateSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_expenseData)
        expenseUpdateSpy = jest
          .spyOn(prisma.expense, 'update')
          .mockResolvedValue(_data)
      })

      it('should update an expense', async () => {
        const result = await service.updateById(
          userIdParam,
          expenseIdParam,
          updateDto
        )

        expect(result).toEqual(_data)
        expect(expenseUpdateSpy).toHaveBeenCalledTimes(1)
      })

      it('should throw if no expense found', async () => {
        expenseFindFirstSpy.mockResolvedValueOnce(null)

        await service
          .getUserExpenseById(userIdParam, 'fakeExpenseId')
          .catch((error: NotFoundException) => {
            expect(error).toBeInstanceOf(NotFoundException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })

      it('should throw if userId is not the same as expense.userId', async () => {
        await service
          .getUserExpenseById('fakeUserId', expenseIdParam)
          .catch((error: ForbiddenException) => {
            expect(error).toBeInstanceOf(ForbiddenException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })
    })
  })

  describe('deleteById()', () => {
    describe('when called', () => {
      const userIdParam = ExpenseStub().userId
      const expenseIdParam = ExpenseStub().id
      const _data = ExpenseStub()

      let expenseFindFirstSpy
      let expenseDeleteSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_data)
        expenseDeleteSpy = jest
          .spyOn(prisma.expense, 'delete')
          .mockResolvedValue(_data)
      })

      it('should update an expense', async () => {
        const result = await service.deleteById(userIdParam, expenseIdParam)

        expect(result).toEqual(_data)
        expect(expenseDeleteSpy).toHaveBeenCalledTimes(1)
      })

      it('should throw if no expense found', async () => {
        expenseFindFirstSpy.mockResolvedValueOnce(null)

        await service
          .getUserExpenseById(userIdParam, 'fakeExpenseId')
          .catch((error: NotFoundException) => {
            expect(error).toBeInstanceOf(NotFoundException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })

      it('should throw if userId is not the same as expense.userId', async () => {
        await service
          .getUserExpenseById('fakeUserId', expenseIdParam)
          .catch((error: ForbiddenException) => {
            expect(error).toBeInstanceOf(ForbiddenException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })
    })
  })
})
