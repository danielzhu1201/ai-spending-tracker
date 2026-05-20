import type {
  DashboardSummary,
  DateGroupedTransactions,
  MoneyValue,
  Transaction,
  TrendDirection,
} from '../../types/domain'
import type { DashboardApiResponse, DashboardTransactionApiDto } from '../mock/dashboardApi'

function toMoney(amount: number, signed: boolean): MoneyValue {
  return {
    amount,
    currency: 'USD',
    signed,
  }
}

function toTrendDirection(value: number): TrendDirection {
  if (value < 0) {
    return 'down'
  }

  if (value > 0) {
    return 'up'
  }

  return 'flat'
}

function toTransaction(dto: DashboardTransactionApiDto): Transaction {
  const normalizedAmount = dto.type === 'expense' ? -Math.abs(dto.amount) : Math.abs(dto.amount)

  return {
    id: dto.id,
    merchant: dto.merchant_name,
    category: dto.category_code,
    categoryLabel: dto.category_label,
    paymentMethod: dto.payment_method_code,
    paymentMethodLabel: dto.payment_method_label,
    kind: dto.type,
    money: toMoney(normalizedAmount, true),
    occurredAt: dto.occurred_at,
    icon: dto.icon,
    tag: dto.tag,
  }
}

export function selectDashboardSummary(api: DashboardApiResponse): DashboardSummary {
  const savings = Math.max(api.period.previous_spend - api.period.current_spend, 0)

  return {
    monthLabel: api.period.label,
    monthlySpend: toMoney(api.period.current_spend, false),
    trend: {
      value: api.period.trend_percent,
      direction: toTrendDirection(api.period.trend_percent),
      period: 'vs last month',
      unit: 'percent',
    },
    comparison: {
      previousMonth: toMoney(api.period.previous_spend, false),
      currentMonth: toMoney(api.period.current_spend, false),
      savingsDelta: toMoney(savings, false),
      progressPct: Math.round((api.period.current_spend / api.period.previous_spend) * 100),
    },
    chartBars: api.period.chart_bars,
    highlightText: `You've spent $${savings.toFixed(2)} less than last month. You're on track for your savings goal!`,
  }
}

export function selectDashboardTransactionGroups(
  api: DashboardApiResponse,
): DateGroupedTransactions[] {
  return api.groups.map((group) => ({
    id: group.id,
    label: group.label,
    transactions: group.transactions.map(toTransaction),
  }))
}
