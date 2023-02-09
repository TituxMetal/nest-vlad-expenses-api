import { Test } from '@nestjs/testing'

import { PrismaService } from '~/prisma'

import { ExpenseService } from './expense.service'

describe('ExpenseService', () => {
  const prismaServiceMock = jest.fn()

  let service: ExpenseService

  beforeAll(async () => {
    const module = Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: PrismaService, useFactory: prismaServiceMock }
      ]
    }).compile()

    service = (await module).get<ExpenseService>(ExpenseService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
