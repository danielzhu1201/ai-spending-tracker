import type { TransactionInfo } from '../../types/domain'

export interface DashboardApiResponse {
  currentMonthSpend: number
  recentTransactions: TransactionInfo[]
}

export const dashboardApiResponseMock: DashboardApiResponse = {
  currentMonthSpend: 1188.75,
  recentTransactions: [],
}
