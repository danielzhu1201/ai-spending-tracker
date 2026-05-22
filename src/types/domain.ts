export type CurrencyCode = 'USD'

export interface MoneyValue {
  amount: number
  currency: CurrencyCode
  signed: boolean
}

export type TrendDirection = 'up' | 'down' | 'flat'

export interface TrendMetric {
  value: number
  direction: TrendDirection
  period: string
  unit: 'percent' | 'amount'
}

export type TransactionKind = 'expense' | 'income'

export type PaymentMethod =
  | 'credit'
  | 'debit'
  | 'direct-deposit'
  | 'auto-pay'
  | 'cash'
  | 'other'

export type TransactionCategory =
  | 'food-dining'
  | 'housing'
  | 'shopping'
  | 'transport'
  | 'salary'
  | 'utilities'
  | 'other'

export interface Transaction {
  id: string
  merchant: string
  category: TransactionCategory
  categoryLabel: string
  paymentMethod: PaymentMethod
  paymentMethodLabel: string
  kind: TransactionKind
  money: MoneyValue
  occurredAt: string
  icon: string
  tag?: string
}

export interface DateGroupedTransactions {
  id: string
  label: string
  transactions: Transaction[]
}

export type TimeRange =
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'this-week'
  | 'this-month'
  | 'last-3-months'

export interface FilterOption {
  id: string
  label: string
  icon?: string
  value: string
  group: 'time' | 'category'
  selected?: boolean
}

export interface DashboardSummary {
  monthLabel: string
  monthlySpend: MoneyValue
  trend: TrendMetric
  comparison: {
    previousMonth: MoneyValue
    currentMonth: MoneyValue
    savingsDelta: MoneyValue
    progressPct: number
  }
  chartBars: number[]
  highlightText: string
}

export interface InsightCard {
  id: string
  title: string
  description: string
  trend: TrendMetric
  icon: string
}

export interface ReceiptScanUiState {
  mode: 'viewfinder' | 'processing' | 'review'
  flashEnabled: boolean
  helperText: string
  progressPct: number
  extractedFields: Array<{
    id: string
    label: string
    value: string
  }>
}

export interface ManualExpenseDraft {
  amount: string
  currency: CurrencyCode
  category: TransactionCategory
  transactionDate: string
  note: string
}

export interface AuthFormState {
  email: string
  password: string
  rememberMe: boolean
  status: 'idle' | 'submitting' | 'success' | 'error'
  errorMessage?: string
}
