import { CACHE_MANAGER } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import { ExpenseController } from './expense.controller'
import { ExpenseService } from './expense.service'

describe('ExpenseController', () => {
  const expenseServiceMock = jest.fn()

  let controller: ExpenseController

  beforeAll(async () => {
    const module = Test.createTestingModule({
      controllers: [ExpenseController],
      providers: [
        { provide: CACHE_MANAGER, useValue: {} },
        { provide: ExpenseService, useFactory: expenseServiceMock }
      ]
    }).compile()

    controller = (await module).get<ExpenseController>(ExpenseController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
