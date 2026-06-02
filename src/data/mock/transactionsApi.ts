import type { TransactionInfo } from '../../types/domain'

export const transactionsApiResponseMock: TransactionInfo[] = [
  {
    amount: '18.45',
    category: 'food-dining',
    transactionDate: '2026-06-02',
    note: 'Sweetgreen',
  },
  {
    amount: '6.50',
    category: 'food-dining',
    transactionDate: '2026-06-02',
    note: 'Blue Bottle Coffee',
  },
  {
    amount: '145.00',
    category: 'shopping',
    transactionDate: '2026-06-01',
    note: 'Everlane',
  },
  {
    amount: '24.80',
    category: 'transport',
    transactionDate: '2026-06-01',
    note: 'Uber',
  },
  {
    amount: '89.20',
    category: 'utilities',
    transactionDate: '2026-05-29',
    note: 'PG&E Energy',
  },
  {
    amount: '2100.00',
    category: 'housing',
    transactionDate: '2026-05-01',
    note: 'Metropolis Rentals',
  },
]
