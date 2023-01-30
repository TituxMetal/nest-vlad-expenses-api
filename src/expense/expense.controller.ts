import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { Expense } from '@prisma/client'

import { GetUserId } from '~/auth'

import { CreateDto, UpdateDto } from './dto'
import { ExpenseService } from './expense.service'

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  async getAllByUserId(@GetUserId() userId: string): Promise<Expense[]> {
    const expenses = await this.expenseService.getAllByUserId(userId)

    return expenses
  }

  @Get(':id')
  async getUserExpenseById(
    @GetUserId() userId: string,
    @Param('id') expenseId: string
  ): Promise<Expense> {
    const expense = await this.expenseService.getUserExpenseById(
      userId,
      expenseId
    )

    return expense
  }

  @Post()
  async create(
    @GetUserId() userId: string,
    @Body() dto: CreateDto
  ): Promise<Expense> {
    console.log({ userId, dto })
    const newExpense = await this.expenseService.create(userId, dto)

    return newExpense
  }

  @Patch(':id')
  async updateById(
    @GetUserId() userId: string,
    @Param('id') expenseId: string,
    @Body() dto: UpdateDto
  ): Promise<Expense> {
    const updatedExpense = await this.expenseService.updateById(
      userId,
      expenseId,
      dto
    )

    return updatedExpense
  }

  @Delete(':id')
  async deleteById(
    @GetUserId() userId: string,
    @Param('id') expenseId: string
  ): Promise<Expense> {
    const deletedExpense = await this.expenseService.deleteById(
      userId,
      expenseId
    )

    return deletedExpense
  }
}
