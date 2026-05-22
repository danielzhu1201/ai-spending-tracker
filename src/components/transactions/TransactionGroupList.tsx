import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import type { DateGroupedTransactions } from '../../types/domain'
import { TransactionRow } from './TransactionRow'

interface TransactionGroupListProps {
  groups: DateGroupedTransactions[]
}

export function TransactionGroupList({ groups }: TransactionGroupListProps) {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        border: '1px solid var(--aura-outline-variant)',
      }}
    >
      <Stack spacing={0}>
        {groups.map((group) => (
          <Stack key={group.id} spacing={0}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                bgcolor: 'var(--aura-surface-container-low)',
                color: 'var(--aura-on-surface-variant)',
                letterSpacing: '0.08em',
              }}
            >
              {group.label}
            </Typography>

            <Stack>
              {group.transactions.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  withDivider={index < group.transactions.length - 1}
                />
              ))}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}
