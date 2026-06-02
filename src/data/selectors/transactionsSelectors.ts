import type { FilterOption, TransactionInfo } from '../../types/domain'
import { transactionFilterOptionsMock } from '../mock/futureScreens'

interface TransactionsPageViewModel {
  searchPlaceholder: string
  timeFilters: FilterOption[]
  categoryFilters: FilterOption[]
  transactions: TransactionInfo[]
}

export function selectTransactionsPageViewModel(
  api: TransactionInfo[],
): TransactionsPageViewModel {
  return {
    searchPlaceholder: 'Search notes, categories, or amounts...',
    timeFilters: transactionFilterOptionsMock.filter((filter) => filter.group === 'time'),
    categoryFilters: transactionFilterOptionsMock.filter((filter) => filter.group === 'category'),
    transactions: api,
  }
}
