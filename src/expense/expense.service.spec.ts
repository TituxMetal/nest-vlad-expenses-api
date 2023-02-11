import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Expense } from '@prisma/client'

import { PaginateDto } from '~/common'
import { PrismaService } from '~/prisma'

import { CreateDto, UpdateDto } from './dto'
import { ExpenseService } from './expense.service'

describe('ExpenseService', () => {
  const now = new Date()
  const userId = 'userid123'
  const _expenseStub = {
    id: 'expenseid123',
    title: 'Test expense title',
    description: 'Test expense description',
    amount: '1200',
    date: now,
    userId
  } as Expense
  const prismaServiceMock = jest.fn().mockReturnValue({
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
  let result

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: PrismaService, useFactory: prismaServiceMock }
      ]
    }).compile()

    service = module.get<ExpenseService>(ExpenseService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getAllByUserId()', () => {
    describe('when called', () => {
      const paginateDto: PaginateDto = { limit: 1, offset: 0 }
      const _expensesStub: Expense[] = [_expenseStub]

      let expenseFindManySpy
      let expenseCountSpy

      beforeEach(async () => {
        expenseFindManySpy = jest
          .spyOn(prisma.expense, 'findMany')
          .mockResolvedValue(_expensesStub)
        expenseCountSpy = jest
          .spyOn(prisma.expense, 'count')
          .mockResolvedValue(paginateDto.limit)
      })

      it('should return expenses array and matching count and hasMore', async () => {
        result = await service.getAllByUserId(userId, paginateDto)

        expect(expenseFindManySpy).toHaveBeenCalledTimes(1)
        expect(expenseCountSpy).toHaveBeenCalledTimes(1)
        expect(result.data).toEqual(expect.any(Array))
        expect(result.count).toBeDefined()
        expect(result.hasMore).toBeDefined()
      })

      it('should return empty array if no expenses found', async () => {
        const expenseId = 'fakeUserId'

        expenseFindManySpy = jest
          .spyOn(prisma.expense, 'findMany')
          .mockResolvedValueOnce([])
        expenseCountSpy = jest
          .spyOn(prisma.expense, 'count')
          .mockResolvedValueOnce(0)

        result = await service.getAllByUserId(expenseId, paginateDto)

        expect(expenseFindManySpy).toHaveBeenCalledTimes(1)
        expect(expenseCountSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual({ data: [], count: 0, hasMore: false })
      })
    })
  })

  describe('getUserExpenseById()', () => {
    describe('when called', () => {
      let expenseFindFirstSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_expenseStub)
      })

      it('should return expense from provided user', async () => {
        const expenseId = _expenseStub.id

        result = await service.getUserExpenseById(userId, expenseId)

        expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual(_expenseStub)
      })

      it('should throw if no expense found', async () => {
        const expenseId = 'fakeId'

        expenseFindFirstSpy.mockResolvedValueOnce(null)

        await service
          .getUserExpenseById(userId, expenseId)
          .catch((error: NotFoundException) => {
            expect(error).toBeInstanceOf(NotFoundException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })

      it('should throw if userId is not matching expense.userId', async () => {
        const expenseId = _expenseStub.id

        await service
          .getUserExpenseById('fakeId', expenseId)
          .catch((error: ForbiddenException) => {
            expect(error).toBeInstanceOf(ForbiddenException)
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
          })
      })
    })
  })

  describe('create()', () => {
    describe('when called', () => {
      it('should create expense', async () => {
        const createDto: CreateDto = {
          amount: '100',
          title: 'Test create expense title',
          description: 'Test create expense description',
          date: now
        }
        const newExpense = { ...createDto, id: 'newId', userId } as Expense
        const expenseCreateSpy = jest
          .spyOn(prisma.expense, 'create')
          .mockResolvedValue(newExpense)

        result = await service.create(userId, createDto)

        expect(expenseCreateSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual(newExpense)
      })
    })
  })

  describe('updateById()', () => {
    describe('when called', () => {
      const updateDto: UpdateDto = {
        amount: '300',
        title: 'Test update expense title',
        description: 'Test update expense description'
      }
      const updatedExpense = { ..._expenseStub, ...updateDto } as Expense

      let expenseFindFirstSpy
      let expenseUpdateSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_expenseStub)
        expenseUpdateSpy = jest
          .spyOn(prisma.expense, 'update')
          .mockResolvedValue(updatedExpense)
      })

      it('should update an expense', async () => {
        const expenseId = _expenseStub.id

        result = await service.updateById(userId, expenseId, updateDto)

        expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
        expect(expenseUpdateSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual(updatedExpense)
      })

      it('should throw if bad expense id provided', async () => {
        const expenseId = 'fakeId'

        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValueOnce(null)

        await service
          .updateById(userId, expenseId, updateDto)
          .catch((error: NotFoundException) => {
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
            expect(expenseUpdateSpy).not.toHaveBeenCalled()
            expect(error).toBeInstanceOf(NotFoundException)
          })
      })

      it('should throw if bad user id provided', async () => {
        const userId = 'fakeId'
        const expenseId = _expenseStub.id

        await service
          .updateById(userId, expenseId, updateDto)
          .catch((error: ForbiddenException) => {
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
            expect(expenseUpdateSpy).not.toHaveBeenCalled()
            expect(error).toBeInstanceOf(ForbiddenException)
          })
      })
    })
  })

  describe('deleteById()', () => {
    describe('when called', () => {
      let expenseFindFirstSpy
      let expenseDeleteSpy

      beforeEach(() => {
        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(_expenseStub)
        expenseDeleteSpy = jest
          .spyOn(prisma.expense, 'delete')
          .mockResolvedValue(_expenseStub)
      })

      it('should return deleted expense', async () => {
        const expenseId = _expenseStub.id

        result = await service.deleteById(userId, expenseId)

        expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
        expect(expenseDeleteSpy).toHaveBeenCalledTimes(1)
        expect(result).toEqual(_expenseStub)
      })

      it('should throw if bad expense id provided', async () => {
        const expenseId = 'fakeId'

        expenseFindFirstSpy = jest
          .spyOn(prisma.expense, 'findFirst')
          .mockResolvedValue(null)

        await service
          .deleteById(userId, expenseId)
          .catch((error: NotFoundException) => {
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
            expect(expenseDeleteSpy).not.toHaveBeenCalled()
            expect(error).toBeInstanceOf(NotFoundException)
          })
      })

      it('should throw if bad user id provided', async () => {
        const expenseId = _expenseStub.id
        const userId = 'fakeId'

        await service
          .deleteById(userId, expenseId)
          .catch((error: ForbiddenException) => {
            expect(expenseFindFirstSpy).toHaveBeenCalledTimes(1)
            expect(expenseDeleteSpy).not.toHaveBeenCalled()
            expect(error).toBeInstanceOf(ForbiddenException)
          })
      })
    })
  })
})
