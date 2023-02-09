import { Role, User } from '@prisma/client'

export const date = new Date()

export const UserStub = (): User => ({
  id: '123',
  email: 'test@example.com',
  firstName: null,
  lastName: null,
  role: Role.USER,
  hash: 'abc',
  initialBalance: 2000,
  currentBalance: 2000,
  createdAt: date,
  updatedAt: date
})

export const UserStubWithCount = () => ({
  ...UserStub(),
  _count: { expenses: 3 }
})
