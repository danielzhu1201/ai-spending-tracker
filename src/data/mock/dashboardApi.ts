export interface DashboardTransactionApiDto {
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

export interface DashboardGroupApiDto {
  id: string
  label: string
  transactions: DashboardTransactionApiDto[]
}

export interface DashboardApiResponse {
  period: {
    label: string
    current_spend: number
    previous_spend: number
    trend_percent: number
    chart_bars: number[]
  }
  groups: DashboardGroupApiDto[]
}

export const dashboardApiResponseMock: DashboardApiResponse = {
  period: {
    label: 'October 2026',
    current_spend: 4820.5,
    previous_spend: 5508.2,
    trend_percent: -12.5,
    chart_bars: [40, 60, 45, 75, 90, 50, 65],
  },
  groups: [
    {
      id: 'today-2026-05-19',
      label: 'Today',
      transactions: [
        {
          id: 'txn_001',
          merchant_name: 'Blue Bottle Coffee',
          category_code: 'food-dining',
          category_label: 'Food & Drink',
          payment_method_code: 'debit',
          payment_method_label: 'Debit',
          type: 'expense',
          amount: 12.45,
          currency: 'USD',
          occurred_at: '2026-05-19T09:20:00.000Z',
          icon: 'restaurant',
          tag: 'debit',
        },
      ],
    },
    {
      id: 'oct-1-2026',
      label: 'Oct 1',
      transactions: [
        {
          id: 'txn_002',
          merchant_name: 'Metropolis Rentals',
          category_code: 'housing',
          category_label: 'Housing',
          payment_method_code: 'auto-pay',
          payment_method_label: 'Auto-pay',
          type: 'expense',
          amount: 2100,
          currency: 'USD',
          occurred_at: '2026-10-01T14:00:00.000Z',
          icon: 'home',
          tag: 'auto-pay',
        },
      ],
    },
    {
      id: 'sep-30-2026',
      label: 'Sep 30',
      transactions: [
        {
          id: 'txn_003',
          merchant_name: 'Apple Inc.',
          category_code: 'salary',
          category_label: 'Salary',
          payment_method_code: 'direct-deposit',
          payment_method_label: 'Direct deposit',
          type: 'income',
          amount: 6400,
          currency: 'USD',
          occurred_at: '2026-09-30T12:00:00.000Z',
          icon: 'payments',
          tag: 'income',
        },
        {
          id: 'txn_004',
          merchant_name: 'Uniqlo Global',
          category_code: 'shopping',
          category_label: 'Shopping',
          payment_method_code: 'credit',
          payment_method_label: 'Credit',
          type: 'expense',
          amount: 89.9,
          currency: 'USD',
          occurred_at: '2026-09-29T19:15:00.000Z',
          icon: 'shopping_bag',
          tag: 'debit',
        },
      ],
    },
  ],
}
