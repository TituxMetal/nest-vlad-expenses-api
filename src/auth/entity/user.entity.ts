import { Role } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserEntity {
  id: string
  email: string

  @Exclude()
  hash: string

  firstName: string | null
  lastName: string | null

  initialBalance: number
  currentBalance: number

  _count: { expenses: number }

  role: Role

  createdAt: Date
  updatedAt: Date

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
