import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { renderMaterialIcon } from '../icons/materialIconMap'
import { IconBadge } from '../ui/IconBadge'
import type { Transaction } from '../../types/domain'
import { formatMoney } from '../../utils/formatters'

interface TransactionRowProps {
  transaction: Transaction
  withDivider?: boolean
}

export function TransactionRow({ transaction, withDivider = true }: TransactionRowProps) {
  const isIncome = transaction.kind === 'income'

  return (
    <>
      <ListItemButton
        sx={{
          px: 2,
          py: 2,
          '&:hover': {
            bgcolor: 'var(--aura-surface-container-low)',
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            width: '100%',
          }}
        >
          <IconBadge tone={isIncome ? 'positive' : 'default'}>
            {renderMaterialIcon(transaction.icon, { fontSize: 'small' })}
          </IconBadge>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{ color: 'var(--aura-primary)', fontWeight: 500 }}
              noWrap
            >
              {transaction.merchant}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
              {transaction.categoryLabel} • {transaction.tag ?? transaction.paymentMethodLabel}
            </Typography>
          </Box>

          <Box
            sx={{
              textAlign: 'right',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--aura-data-mono, JetBrains Mono, ui-monospace, monospace)',
                color: isIncome ? 'var(--aura-secondary)' : 'var(--aura-primary)',
                fontWeight: isIncome ? 600 : 500,
              }}
            >
              {formatMoney(transaction.money)}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: isIncome
                  ? 'var(--aura-secondary)'
                  : 'var(--aura-on-surface-variant)',
              }}
            >
              {isIncome ? 'Income' : 'Debit'}
            </Typography>
          </Box>
        </Stack>
      </ListItemButton>
      {withDivider ? <Divider /> : null}
    </>
  )
}
