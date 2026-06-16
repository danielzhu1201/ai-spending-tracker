export interface MoneyValue {
  amount: number
  signed: boolean
}

export interface InsightCard {
  id: string
  title: string
  description: string
  icon: string
}

export type TransactionCategory =
  | ''
  | 'food-dining'
  | 'housing'
  | 'shopping'
  | 'transport'
  | 'utilities'
  | 'other'

export interface FilterOption {
  id: string
  label: string
  icon?: string
  value: string
  group: 'time' | 'category'
  selected?: boolean
}

export interface TransactionInfo {
  amount: string
  category: TransactionCategory
  transactionDate: string
  note: string
}
