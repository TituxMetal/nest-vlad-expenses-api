import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Expense } from '@prisma/client'

import { PrismaService } from '~/prisma'

@Injectable()
export class SchedulerService {
  private logger = new Logger(SchedulerService.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async computeBalances() {
    const users = await this.prisma.user.findMany({
      include: { expenses: true }
    })

    for (const user of users) {
      const sum = user.expenses.reduce(
        (prev: number, next: Expense) => prev + Number(next.amount),
        0
      )

      if (user.initialBalance - sum >= user.currentBalance) {
        continue
      }

      try {
        await this.prisma.user.update({
          where: { id: user.id },
          data: { currentBalance: user.currentBalance - sum }
        })
      } catch (error) {
        this.logger.error({ error })
      }

      this.logger.log(`computeBalances() ran for ${users.length} users.`)
    }
  }
}
