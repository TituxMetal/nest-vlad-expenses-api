import { CACHE_MANAGER } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Expense } from '@prisma/client'

import { PaginateDto, PaginateResultType } from '~/common'

import { CreateDto, UpdateDto } from './dto'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'

describe('ExpenseController', () => {
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
  const _paginateResultStub: PaginateResultType = {
    data: [{ ..._expenseStub }],
    count: 1,
    hasMore: false
  }
  const expenseServiceMock = jest.fn().mockReturnValue({
    getUserExpenseById: jest.fn().mockResolvedValue(_expenseStub),
    getAllByUserId: jest.fn().mockResolvedValue(_paginateResultStub),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValue(_expenseStub)
  })

  let controller: ExpenseController
  let service: ExpenseService
  let result

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        { provide: CACHE_MANAGER, useValue: {} },
        { provide: ExpenseService, useFactory: expenseServiceMock }
      ]
    }).compile()

    controller = module.get<ExpenseController>(ExpenseController)
    service = module.get<ExpenseService>(ExpenseService)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getAllByUserId()', () => {
    describe('when called', () => {
      it('should return with paginated expenses', async () => {
        const paginateDto = new PaginateDto()

        result = await controller.getAllByUserId(userId, paginateDto)

        expect(result).toEqual(_paginateResultStub)
      })
    })
  })

  describe('getUserExpenseById()', () => {
    describe('when called', () => {
      it('should return expense object matching id and userId', async () => {
        const expenseId = 'expenseid123'

        result = await controller.getUserExpenseById(userId, expenseId)

        expect(typeof result).toBe('object')
        expect(result.id).toEqual(expenseId)
        expect(result.userId).toEqual(userId)
      })
    })
  })

  describe('create()', () => {
    describe('when called', () => {
      it('should return new expense', async () => {
        const createDto: CreateDto = {
          amount: '130',
          date: now,
          title: 'Create test expense title',
          description: 'Create test expense description'
        }
        const _newExpense = {
          id: 'newExpenseId',
          ...createDto,
          userId
        } as Expense

        jest.spyOn(service, 'create').mockResolvedValue(_newExpense)

        result = await controller.create(userId, createDto)

        expect(result).toMatchObject(createDto)
      })
    })
  })

  describe('updateById()', () => {
    describe('when called', () => {
      it('should return updated expense', async () => {
        const expenseId = 'expenseid123'
        const updateDto: UpdateDto = {
          amount: '130',
          date: now,
          title: 'Update test expense title',
          description: 'Update test expense description'
        }
        const _updatedExpense = {
          id: expenseId,
          ...updateDto,
          userId
        } as Expense

        jest.spyOn(service, 'updateById').mockResolvedValue(_updatedExpense)

        result = await controller.updateById(userId, expenseId, updateDto)

        expect(result).toMatchObject(updateDto)
      })
    })
  })

  describe('deleteById()', () => {
    describe('when called', () => {
      it('should return deleted expense', async () => {
        const expenseId = 'expenseid123'

        result = await controller.deleteById(userId, expenseId)

        expect(result).toMatchObject(_expenseStub)
      })
    })
  })
})
