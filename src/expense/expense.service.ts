import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Expense } from '@prisma/client'

import { PaginateDto, PaginateResultType } from '~/common'
import { PrismaService } from '~/prisma'

import { CreateDto, UpdateDto } from './dto'

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllByUserId(
    userId: string,
    { limit, offset }: PaginateDto
  ): Promise<PaginateResultType> {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
      take: limit,
      skip: offset
    })
    const count = await this.prisma.expense.count({ where: { userId } })
    const hasMore = this.hasMore(count, limit, offset)

    return { data: expenses, count, hasMore }
  }

  private hasMore(count: number, limit: number, offset: number): boolean {
    return count > limit + offset
  }

  async getUserExpenseById(
    userId: string,
    expenseId: string
  ): Promise<Expense> {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId }
    })

    if (!expense) {
      throw new NotFoundException('Resource not found.')
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('Access to resource unauthorized.')
    }

    return expense
  }

  async create(userId: string, dto: CreateDto): Promise<Expense> {
    const newExpense = await this.prisma.expense.create({
      data: { ...dto, userId }
    })

    return newExpense
  }

  async updateById(
    userId: string,
    expenseId: string,
    dto: UpdateDto
  ): Promise<Expense> {
    const { id } = await this.getUserExpenseById(userId, expenseId)
    const updatedExpense = await this.prisma.expense.update({
      where: { id },
      data: { ...dto }
    })

    return updatedExpense
  }

  async deleteById(userId: string, expenseId: string): Promise<Expense> {
    const expense = await this.getUserExpenseById(userId, expenseId)

    await this.prisma.expense.delete({ where: { id: expense.id } })

    return expense
  }
}
