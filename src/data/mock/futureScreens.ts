import type {
  AuthFormState,
  FilterOption,
  InsightCard,
  ManualExpenseDraft,
  ReceiptScanUiState,
  TimeRange,
} from '../../types/domain'

export const insightTimeRanges: TimeRange[] = ['weekly', 'monthly', 'yearly']

export const insightCardsMock: InsightCard[] = [
  {
    id: 'insight-dining',
    title: 'Dining Behavior',
    description:
      'You spent 15% more on dining than last month. Consider shifting three meals to home cooking to save $140 next month.',
    trend: {
      value: 15.4,
      direction: 'up',
      period: 'vs last month',
      unit: 'percent',
    },
    icon: 'restaurant',
  },
]

export const transactionFilterOptionsMock: FilterOption[] = [
  { id: 'time-this-month', label: 'This Month', value: 'this-month', group: 'time', selected: true },
  { id: 'time-this-week', label: 'This Week', value: 'this-week', group: 'time' },
  { id: 'time-last-3-months', label: 'Last 3 Months', value: 'last-3-months', group: 'time' },
  { id: 'category-food', label: 'Food', value: 'food-dining', icon: 'restaurant', group: 'category' },
  { id: 'category-housing', label: 'Housing', value: 'housing', icon: 'home', group: 'category' },
]

export const manualExpenseDraftMock: ManualExpenseDraft = {
  amount: '',
  currency: 'USD',
  category: 'food-dining',
  transactionDate: '2026-05-19',
  note: '',
}

export const manualExpenseCategoryOptionsMock: FilterOption[] = [
  {
    id: 'manual-category-dining',
    label: 'Dining',
    value: 'food-dining',
    icon: 'restaurant',
    group: 'category',
    selected: true,
  },
  {
    id: 'manual-category-shopping',
    label: 'Shopping',
    value: 'shopping',
    icon: 'shopping_bag',
    group: 'category',
  },
  {
    id: 'manual-category-transport',
    label: 'Transport',
    value: 'transport',
    icon: 'commute',
    group: 'category',
  },
  {
    id: 'manual-category-bills',
    label: 'Bills',
    value: 'housing',
    icon: 'home',
    group: 'category',
  },
  {
    id: 'manual-category-other',
    label: 'Other',
    value: 'other',
    icon: 'more_horiz',
    group: 'category',
  },
]

export const manualExpenseTipMock = {
  title: 'Spending Tip',
  message:
    "You've stayed within your daily budget for 5 days straight. Keeping this entry under $40 will maintain your streak!",
}

export const receiptScanUiStateMock: ReceiptScanUiState = {
  mode: 'viewfinder',
  flashEnabled: false,
  helperText: 'Align receipt within frame',
  progressPct: 64,
  extractedFields: [
    {
      id: 'vendor',
      label: 'Merchant',
      value: 'Blue Bottle Coffee',
    },
    {
      id: 'total',
      label: 'Total',
      value: '$12.45',
    },
  ],
}

export const authFormStateMock: AuthFormState = {
  email: '',
  password: '',
  rememberMe: true,
  status: 'idle',
}
