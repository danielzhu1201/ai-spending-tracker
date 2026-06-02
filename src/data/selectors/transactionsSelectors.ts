import type { TransactionInfo } from '../../types/domain'

interface TransactionsPageViewModel {
  searchPlaceholder: string
  transactions: TransactionInfo[]
}

export function selectTransactionsPageViewModel(
  api: TransactionInfo[],
): TransactionsPageViewModel {
  return {
    searchPlaceholder: 'Search notes, categories, or amounts...',
    transactions: api,
  }
}
