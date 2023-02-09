const now = new Date()

export const ExpenseStub = () => ({
  id: '1234',
  title: 'expense title',
  description: 'expense description',
  amount: '120',
  date: now,
  createdAt: now,
  updatedAt: now,
  userId: '123'
})

export const PaginatedExpensesStub = () => ({
  data: [ExpenseStub()],
  count: 1,
  hasMore: false
})
