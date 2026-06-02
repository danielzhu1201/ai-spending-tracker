import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import ListItemButton from '@mui/material/ListItemButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { renderMaterialIcon } from '../icons/materialIconMap'
import { IconBadge } from '../ui/IconBadge'
import type { TransactionInfo } from '../../types/domain'
import { formatMoney } from '../../utils/formatters'
import {
  getManualExpenseCategoryDisplay,
  toManualExpenseMoney,
} from '../../utils/manualExpense'

interface TransactionRowProps {
  transaction: TransactionInfo
  withDivider?: boolean
}

export function TransactionRow({ transaction, withDivider = true }: TransactionRowProps) {
  const categoryDisplay = getManualExpenseCategoryDisplay(transaction.category)
  const title = transaction.note.trim() || categoryDisplay.label

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
          <IconBadge tone="default">
            {renderMaterialIcon(categoryDisplay.icon, { fontSize: 'small' })}
          </IconBadge>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body1"
              sx={{ color: 'var(--aura-primary)', fontWeight: 500 }}
              noWrap
            >
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
              {categoryDisplay.label} • {transaction.transactionDate}
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
                color: 'var(--aura-primary)',
                fontWeight: 500,
              }}
            >
              {formatMoney(toManualExpenseMoney(transaction))}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'var(--aura-on-surface-variant)',
              }}
            >
              Expense
            </Typography>
          </Box>
        </Stack>
      </ListItemButton>
      {withDivider ? <Divider /> : null}
    </>
  )
}
