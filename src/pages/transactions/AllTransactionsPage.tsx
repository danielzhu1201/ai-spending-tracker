import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'

import { renderMaterialIcon } from '../../components/icons/materialIconMap'
import { PageContainer } from '../../components/layout/PageContainer'
import { TransactionRow } from '../../components/transactions/TransactionRow'
import { FilterChip } from '../../components/ui/FilterChip'
import { transactionsApiResponseMock } from '../../data/mock/transactionsApi'
import { selectTransactionsPageViewModel } from '../../data/selectors/transactionsSelectors'
import type { TransactionInfo } from '../../types/domain'
import { formatMoney } from '../../utils/formatters'
import {
  getManualExpenseCategoryDisplay,
  toManualExpenseMoney,
} from '../../utils/manualExpense'

const viewModel = selectTransactionsPageViewModel(transactionsApiResponseMock)

export function AllTransactionsPage() {
  const [query, setQuery] = useState('')
  const [selectedTimeValue, setSelectedTimeValue] = useState(
    viewModel.timeFilters.find((filter) => filter.selected)?.value ?? viewModel.timeFilters[0]?.value,
  )
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string | null>(null)

  const filteredTransactions = useMemo(() => {
    const allDates = viewModel.transactions.map((transaction) =>
      new Date(transaction.transactionDate).getTime(),
    )
    const latestTimestamp = allDates.length > 0 ? Math.max(...allDates) : 0

    const matchesTimeFilter = (transaction: TransactionInfo): boolean => {
      const txTime = new Date(transaction.transactionDate).getTime()
      const diffMs = latestTimestamp - txTime

      switch (selectedTimeValue) {
        case 'this-week':
          return diffMs <= 7 * 24 * 60 * 60 * 1000
        case 'last-3-months':
          return diffMs <= 90 * 24 * 60 * 60 * 1000
        case 'this-month': {
          const latestDate = new Date(latestTimestamp)
          const txDate = new Date(txTime)
          return (
            latestDate.getFullYear() === txDate.getFullYear() &&
            latestDate.getMonth() === txDate.getMonth()
          )
        }
        default:
          return true
      }
    }

    const queryLower = query.trim().toLowerCase()

    return viewModel.transactions.filter((transaction) => {
      if (selectedCategoryValue && transaction.category !== selectedCategoryValue) {
        return false
      }

      if (!matchesTimeFilter(transaction)) {
        return false
      }

      if (queryLower.length === 0) {
        return true
      }

      const categoryDisplay = getManualExpenseCategoryDisplay(transaction.category)
      const searchableText = [
        transaction.note,
        categoryDisplay.label,
        transaction.transactionDate,
        formatMoney(toManualExpenseMoney(transaction)),
      ]
        .join(' ')
        .toLowerCase()

      return searchableText.includes(queryLower)
    })
  }, [query, selectedCategoryValue, selectedTimeValue])

  return (
    <>
      <PageContainer>
        <Stack spacing={3}>
          <Paper
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid var(--aura-outline-variant)',
              bgcolor: 'var(--aura-surface-container-low)',
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 0.5 }}>
              <Avatar
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRrycEdCbpQRIwkZY6ouQmGSk3oJdTqNKM8QFhTJmTogx1BY6yXqXG1lk-RIOofBjl-24-eh2IINu8po59zS0qgm_b7eOqpWPGpKgzcxAUfF_4QQQKN9MNlzR9C3JdtSFgFyCtbRxbkgwO0sz4A3B7WOBxFF3i6sGzGK22lFxfNU2FPQu1NLUlan7J9OEV2-kQ8F9MqgidgmEStDBmKjfrFbFEDCiGPFDBse_n1ZrnRylUQJ8DKwnkvPiGn3WqwHHyRKLB0_7IKTnB"
                alt="Aura Pro avatar"
                sx={{ width: 48, height: 48, border: '2px solid var(--aura-primary)' }}
              />
              <Stack spacing={0.2}>
                <Typography variant="body1" sx={{ color: 'var(--aura-primary)', fontWeight: 600 }}>
                  Aura Pro
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                  Mindful Spending
                </Typography>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    width: 'fit-content',
                    mt: 0.4,
                    px: 1,
                    py: 0.2,
                    borderRadius: '999px',
                    bgcolor: 'rgba(0, 108, 73, 0.12)',
                    color: 'var(--aura-secondary)',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Premium Plan
                </Box>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={0.5}>
            <Typography variant="h2" sx={{ color: 'var(--aura-primary)' }}>
              Transactions
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--aura-on-surface-variant)' }}>
              Review your recent mindful spending.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <TextField
              fullWidth
              placeholder={viewModel.searchPlaceholder}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRoundedIcon
                      sx={{
                        color: 'var(--aura-outline)',
                        mr: 1,
                      }}
                    />
                  ),
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'var(--aura-surface-container-low)',
                  borderRadius: '12px',
                },
              }}
            />

            <Box className="no-scrollbar" sx={{ overflowX: 'auto', pb: 0.5 }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  width: 'max-content',
                  alignItems: 'center',
                }}
              >
                {viewModel.timeFilters.map((filter) => (
                  <FilterChip
                    key={filter.id}
                    label={filter.label}
                    selected={selectedTimeValue === filter.value}
                    onClick={() => {
                      setSelectedTimeValue(filter.value)
                    }}
                  />
                ))}

                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                {viewModel.categoryFilters.map((filter) => (
                  <FilterChip
                    key={filter.id}
                    label={filter.label}
                    icon={filter.icon ? renderMaterialIcon(filter.icon, { fontSize: 'small' }) : undefined}
                    selected={selectedCategoryValue === filter.value}
                    onClick={() => {
                      setSelectedCategoryValue((current) =>
                        current === filter.value ? null : filter.value,
                      )
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              overflow: 'hidden',
              borderRadius: '12px',
              borderColor: 'var(--aura-outline-variant)',
            }}
          >
            {filteredTransactions.length === 0 ? (
              <Stack spacing={1} sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: 'var(--aura-primary)' }}>
                  No transactions found
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                  Try changing filters or search terms.
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={0}>
                {filteredTransactions.map((transaction, index) => (
                  <TransactionRow
                    key={`${transaction.transactionDate}-${transaction.category}-${transaction.amount}-${index}`}
                    transaction={transaction}
                    withDivider={index < filteredTransactions.length - 1}
                  />
                ))}
              </Stack>
            )}
          </Paper>

          <Box sx={{ textAlign: 'center', pb: 2 }}>
            <Button sx={{ color: 'var(--aura-primary)' }}>Load more transactions</Button>
          </Box>
        </Stack>
      </PageContainer>
    </>
  )
}
