import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'

import type { TransactionInfo } from '../../types/domain'
import { TransactionRow } from './TransactionRow'

interface TransactionListProps {
  transactions: TransactionInfo[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        border: '1px solid var(--aura-outline-variant)',
      }}
    >
      <Stack spacing={0}>
        {transactions.map((transaction, index) => (
          <TransactionRow
            key={`${transaction.transactionDate}-${transaction.category}-${transaction.amount}-${index}`}
            transaction={transaction}
            withDivider={index < transactions.length - 1}
          />
        ))}
      </Stack>
    </Card>
  )
}
