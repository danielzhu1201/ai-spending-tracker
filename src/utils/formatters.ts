import type { MoneyValue } from '../types/domain'

export function formatMoney(value: MoneyValue): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: value.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const amount = formatter.format(Math.abs(value.amount))

  if (!value.signed) {
    return amount
  }

  return value.amount > 0 ? `+${amount}` : `-${amount}`
}

export function formatPercent(value: number): string {
  return `${Math.abs(value).toFixed(1)}%`
}
