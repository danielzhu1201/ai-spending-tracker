export interface TransactionApiDto {
  id: string
  merchant_name: string
  category_code:
    | 'food-dining'
    | 'housing'
    | 'shopping'
    | 'transport'
    | 'salary'
    | 'utilities'
    | 'other'
  category_label: string
  payment_method_code:
    | 'credit'
    | 'debit'
    | 'direct-deposit'
    | 'auto-pay'
    | 'cash'
    | 'other'
  payment_method_label: string
  type: 'expense' | 'income'
  amount: number
  currency: 'USD'
  occurred_at: string
  icon: string
  tag?: string
}

export interface TransactionsGroupApiDto {
  id: string
  label: string
  transactions: TransactionApiDto[]
}

export interface TransactionsFilterApiDto {
  id: string
  label: string
  value: string
  group: 'time' | 'category'
  icon?: string
  selected?: boolean
}

export interface TransactionsApiResponse {
  search_placeholder: string
  filters: TransactionsFilterApiDto[]
  groups: TransactionsGroupApiDto[]
}

export const transactionsApiResponseMock: TransactionsApiResponse = {
  search_placeholder: 'Search merchants, categories, or amounts...',
  filters: [
    {
      id: 'time-this-month',
      label: 'This Month',
      value: 'this-month',
      group: 'time',
      selected: true,
    },
    {
      id: 'time-this-week',
      label: 'This Week',
      value: 'this-week',
      group: 'time',
    },
    {
      id: 'time-last-3-months',
      label: 'Last 3 Months',
      value: 'last-3-months',
      group: 'time',
    },
    {
      id: 'category-food',
      label: 'Food',
      value: 'food-dining',
      icon: 'restaurant',
      group: 'category',
    },
    {
      id: 'category-housing',
      label: 'Housing',
      value: 'housing',
      icon: 'home',
      group: 'category',
    },
    {
      id: 'category-shopping',
      label: 'Shopping',
      value: 'shopping',
      icon: 'shopping_bag',
      group: 'category',
    },
    {
      id: 'category-transport',
      label: 'Transport',
      value: 'transport',
      icon: 'directions_car',
      group: 'category',
    },
  ],
  groups: [
    {
      id: 'today-oct-24',
      label: 'Today, Oct 24',
      transactions: [
        {
          id: 'txn_trx_001',
          merchant_name: 'Sweetgreen',
          category_code: 'food-dining',
          category_label: 'Food & Dining',
          payment_method_code: 'credit',
          payment_method_label: 'Credit',
          type: 'expense',
          amount: 18.45,
          currency: 'USD',
          occurred_at: '2026-10-24T12:02:00.000Z',
          icon: 'restaurant',
        },
        {
          id: 'txn_trx_002',
          merchant_name: 'Blue Bottle Coffee',
          category_code: 'food-dining',
          category_label: 'Food & Dining',
          payment_method_code: 'debit',
          payment_method_label: 'Debit',
          type: 'expense',
          amount: 6.5,
          currency: 'USD',
          occurred_at: '2026-10-24T09:11:00.000Z',
          icon: 'local_cafe',
        },
      ],
    },
    {
      id: 'yesterday-oct-23',
      label: 'Yesterday, Oct 23',
      transactions: [
        {
          id: 'txn_trx_003',
          merchant_name: 'Acme Corp Payroll',
          category_code: 'salary',
          category_label: 'Income',
          payment_method_code: 'direct-deposit',
          payment_method_label: 'Direct Dep',
          type: 'income',
          amount: 3250,
          currency: 'USD',
          occurred_at: '2026-10-23T08:00:00.000Z',
          icon: 'payments',
        },
        {
          id: 'txn_trx_004',
          merchant_name: 'Everlane',
          category_code: 'shopping',
          category_label: 'Shopping',
          payment_method_code: 'credit',
          payment_method_label: 'Credit',
          type: 'expense',
          amount: 145,
          currency: 'USD',
          occurred_at: '2026-10-23T19:14:00.000Z',
          icon: 'shopping_bag',
        },
        {
          id: 'txn_trx_005',
          merchant_name: 'Uber',
          category_code: 'transport',
          category_label: 'Transport',
          payment_method_code: 'debit',
          payment_method_label: 'Debit',
          type: 'expense',
          amount: 24.8,
          currency: 'USD',
          occurred_at: '2026-10-23T22:33:00.000Z',
          icon: 'directions_car',
        },
      ],
    },
    {
      id: 'oct-20',
      label: 'Oct 20',
      transactions: [
        {
          id: 'txn_trx_006',
          merchant_name: 'PG&E Energy',
          category_code: 'utilities',
          category_label: 'Housing & Utils',
          payment_method_code: 'auto-pay',
          payment_method_label: 'Auto-pay',
          type: 'expense',
          amount: 89.2,
          currency: 'USD',
          occurred_at: '2026-10-20T10:10:00.000Z',
          icon: 'home',
        },
      ],
    },
  ],
}
