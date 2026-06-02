import type { MoneyValue, TransactionCategory, TransactionInfo } from '../types/domain'

const categoryDisplayMap: Record<TransactionCategory, { label: string; icon: string }> = {
  'food-dining': {
    label: 'Food & Dining',
    icon: 'restaurant',
  },
  housing: {
    label: 'Housing',
    icon: 'home',
  },
  shopping: {
    label: 'Shopping',
    icon: 'shopping_bag',
  },
  transport: {
    label: 'Transport',
    icon: 'directions_car',
  },
  utilities: {
    label: 'Utilities',
    icon: 'subscriptions',
  },
  other: {
    label: 'Other',
    icon: 'more_horiz',
  },
}

export function getManualExpenseCategoryDisplay(category: TransactionCategory) {
  return categoryDisplayMap[category]
}

export function toManualExpenseMoney(
  transaction: TransactionInfo,
  signed = true,
): MoneyValue {
  return {
    amount: -Math.abs(Number.parseFloat(transaction.amount) || 0),
    signed,
  }
}
