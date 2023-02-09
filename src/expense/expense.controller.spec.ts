import { CACHE_MANAGER } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { Expense } from '@prisma/client'
import { isArray } from 'class-validator'

import { PaginateDto, PaginateResultType } from '~/common'
import { ExpenseStub, PaginatedExpensesStub } from '~/common/test/stubs'

import { CreateDto, UpdateDto } from './dto'
import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'

describe('ExpenseController', () => {
  const expenseServiceMock = jest.fn().mockReturnValue({
    getAllByUserId: jest.fn(),
    getUserExpenseById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn()
  })

  let controller: ExpenseController
  let service: ExpenseService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        {
          provide: ExpenseService,
          useFactory: expenseServiceMock
        },
        { provide: CACHE_MANAGER, useValue: {} }
      ]
    }).compile()

    controller = module.get<ExpenseController>(ExpenseController)
    service = module.get<ExpenseService>(ExpenseService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  const userIdParam = ExpenseStub().userId
  const expenseIdParam = ExpenseStub().id

  describe('getAllByUserId()', () => {
    describe('when called', () => {
      it('should return expenses data array and matching count and hasMore', async () => {
        const _data: PaginateResultType = PaginatedExpensesStub()
        const paginateQueryParam = new PaginateDto()
        jest.spyOn(service, 'getAllByUserId').mockResolvedValue(_data)

        const result: PaginateResultType = await controller.getAllByUserId(
          userIdParam,
          paginateQueryParam
        )

        expect(isArray(result.data)).toBe(true)
        expect(result.count).toBeDefined()
        expect(result.hasMore).toBeDefined()
      })
    })
  })

  describe('getUserExpenseById()', () => {
    describe('when called', () => {
      it('should return expense object matching id and userId', async () => {
        const _data = ExpenseStub()
        jest.spyOn(service, 'getUserExpenseById').mockResolvedValue(_data)

        const result = await controller.getUserExpenseById(
          userIdParam,
          expenseIdParam
        )

        expect(typeof result).toBe('object')
        expect(result.userId).toEqual(userIdParam)
        expect(result.id).toEqual(expenseIdParam)
      })
    })
  })

  describe('create()', () => {
    describe('when called', () => {
      it('should return new expense', async () => {
        const now = new Date()
        const newExpenseDto: CreateDto = {
          amount: '150',
          date: now,
          title: 'Test expense 1',
          description: 'Test expense 1 description'
        }
        const _data = {
          ...newExpenseDto,
          userId: userIdParam,
          id: 'abc',
          createdAt: now,
          updatedAt: now
        } as Expense
        jest.spyOn(service, 'create').mockResolvedValue(_data)

        const result = await controller.create(userIdParam, newExpenseDto)

        expect(result).toMatchObject(newExpenseDto)
      })
    })
  })

  describe('updateById()', () => {
    describe('when called', () => {
      it('should return new expense', async () => {
        const now = new Date()
        const updateExpenseDto: UpdateDto = {
          amount: '150',
          title: 'Test expense 1',
          description: 'Test expense 1 description'
        }
        const _data = {
          ...updateExpenseDto,
          userId: userIdParam,
          date: now,
          id: 'abc',
          createdAt: now,
          updatedAt: now
        } as Expense
        jest.spyOn(service, 'updateById').mockResolvedValue(_data)

        const result = await controller.updateById(
          userIdParam,
          expenseIdParam,
          updateExpenseDto
        )

        expect(result).toMatchObject(updateExpenseDto)
      })
    })
  })

  describe('deleteById()', () => {
    describe('when called', () => {
      it('should return new expense', async () => {
        const _data = ExpenseStub() as Expense
        jest.spyOn(service, 'deleteById').mockResolvedValue(_data)

        const result = await controller.deleteById(userIdParam, expenseIdParam)

        expect(result).toMatchObject(_data)
      })
    })
  })
})
