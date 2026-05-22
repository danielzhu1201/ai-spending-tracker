import type {
  DateGroupedTransactions,
  FilterOption,
  MoneyValue,
  Transaction,
} from '../../types/domain'
import type {
  TransactionApiDto,
  TransactionsApiResponse,
} from '../mock/transactionsApi'

interface TransactionsPageViewModel {
  searchPlaceholder: string
  timeFilters: FilterOption[]
  categoryFilters: FilterOption[]
  groups: DateGroupedTransactions[]
}

function toMoney(amount: number, signed: boolean): MoneyValue {
  return {
    amount,
    currency: 'USD',
    signed,
  }
}

function toTransaction(dto: TransactionApiDto): Transaction {
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

export function selectTransactionsPageViewModel(
  api: TransactionsApiResponse,
): TransactionsPageViewModel {
  const filters = api.filters.map<FilterOption>((filter) => ({
    id: filter.id,
    label: filter.label,
    value: filter.value,
    icon: filter.icon,
    group: filter.group,
    selected: filter.selected,
  }))

  return {
    searchPlaceholder: api.search_placeholder,
    timeFilters: filters.filter((filter) => filter.group === 'time'),
    categoryFilters: filters.filter((filter) => filter.group === 'category'),
    groups: api.groups.map((group) => ({
      id: group.id,
      label: group.label,
      transactions: group.transactions.map(toTransaction),
    })),
  }
}
