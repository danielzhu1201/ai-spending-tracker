import type { MoneyValue } from '../../types/domain'
import type { DashboardApiResponse } from '../mock/dashboardApi'

function toMoney(amount: number): MoneyValue {
  return {
    amount,
    signed: false,
  }
}

export function selectDashboardSummary(api: DashboardApiResponse) {
  return {
    currentMonthSpend: toMoney(api.currentMonthSpend),
    recentTransactions: api.recentTransactions,
  }
}
