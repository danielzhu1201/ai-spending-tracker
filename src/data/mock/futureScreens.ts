import type {
  FilterOption,
  TransactionInfo,
} from '../../types/domain'

export const transactionFilterOptionsMock: FilterOption[] = [
  { id: 'time-this-month', label: 'This Month', value: 'this-month', group: 'time', selected: true },
  { id: 'time-this-week', label: 'This Week', value: 'this-week', group: 'time' },
  { id: 'time-last-3-months', label: 'Last 3 Months', value: 'last-3-months', group: 'time' },
  { id: 'category-food', label: 'Food', value: 'food-dining', icon: 'restaurant', group: 'category' },
  { id: 'category-housing', label: 'Housing', value: 'housing', icon: 'home', group: 'category' },
]

export const manualExpenseDraftMock: TransactionInfo = {
  amount: '',
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
