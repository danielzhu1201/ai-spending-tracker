import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useMemo, useState } from 'react'

import { renderMaterialIcon } from '../../components/icons/materialIconMap'
import { AppTopBar } from '../../components/layout/AppTopBar'
import { DesktopSideNav } from '../../components/layout/DesktopSideNav'
import { MobileBottomNav } from '../../components/layout/MobileBottomNav'
import { PageContainer } from '../../components/layout/PageContainer'
import { FilterChip } from '../../components/ui/FilterChip'
import {
  desktopTransactionsNavigationItems,
  mobileNavigationItems,
} from '../../config/navigation'
import { transactionsApiResponseMock } from '../../data/mock/transactionsApi'
import { selectTransactionsPageViewModel } from '../../data/selectors/transactionsSelectors'
import type { PaymentMethod, Transaction } from '../../types/domain'
import { formatMoney } from '../../utils/formatters'

const paymentMethodIconMap: Record<PaymentMethod, string> = {
  credit: 'credit_card',
  debit: 'contactless',
  'direct-deposit': 'account_balance',
  'auto-pay': 'autorenew',
  cash: 'payments',
  other: 'more_horiz',
}

const viewModel = selectTransactionsPageViewModel(transactionsApiResponseMock)

export function AllTransactionsPage() {
  const [query, setQuery] = useState('')
  const [selectedTimeValue, setSelectedTimeValue] = useState(
    viewModel.timeFilters.find((filter) => filter.selected)?.value ?? viewModel.timeFilters[0]?.value,
  )
  const [selectedCategoryValue, setSelectedCategoryValue] = useState<string | null>(null)

  const filteredGroups = useMemo(() => {
    const allDates = viewModel.groups.flatMap((group) =>
      group.transactions.map((transaction) => new Date(transaction.occurredAt).getTime()),
    )
    const latestTimestamp = allDates.length > 0 ? Math.max(...allDates) : 0

    const matchesTimeFilter = (transaction: Transaction): boolean => {
      const txTime = new Date(transaction.occurredAt).getTime()
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

    return viewModel.groups
      .map((group) => {
        const transactions = group.transactions.filter((transaction) => {
          if (selectedCategoryValue && transaction.category !== selectedCategoryValue) {
            return false
          }

          if (!matchesTimeFilter(transaction)) {
            return false
          }

          if (queryLower.length === 0) {
            return true
          }

          const searchableText = [
            transaction.merchant,
            transaction.categoryLabel,
            transaction.paymentMethodLabel,
            formatMoney(transaction.money),
          ]
            .join(' ')
            .toLowerCase()

          return searchableText.includes(queryLower)
        })

        return {
          ...group,
          transactions,
        }
      })
      .filter((group) => group.transactions.length > 0)
  }, [query, selectedCategoryValue, selectedTimeValue])

  return (
    <>
      <AppTopBar title="Aura Finance" />

      <DesktopSideNav
        items={desktopTransactionsNavigationItems}
        header={(
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1 }}>
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
        )}
      />

      <PageContainer className="lg:ml-[280px]">
        <Stack spacing={3}>
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
            {filteredGroups.length === 0 ? (
              <Stack spacing={1} sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: 'var(--aura-primary)' }}>
                  No transactions found
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                  Try changing filters or search terms.
                </Typography>
              </Stack>
            ) : (
              filteredGroups.map((group) => (
                <Box key={group.id}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      px: 2,
                      py: 1,
                      bgcolor: 'var(--aura-surface-container-low)',
                      color: 'var(--aura-on-surface-variant)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {group.label}
                  </Typography>

                  <List disablePadding>
                    {group.transactions.map((transaction, index) => {
                      const isIncome = transaction.kind === 'income'

                      return (
                        <Box key={transaction.id}>
                          <ListItemButton sx={{ py: 1.75, px: 2 }}>
                            <Stack
                              direction="row"
                              spacing={1.5}
                              sx={{ width: '100%', alignItems: 'center' }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '999px',
                                  display: 'grid',
                                  placeItems: 'center',
                                  bgcolor: isIncome
                                    ? 'rgba(108, 248, 187, 0.3)'
                                    : 'rgba(218, 226, 253, 0.45)',
                                  color: isIncome
                                    ? 'var(--aura-secondary)'
                                    : 'var(--aura-primary-container)',
                                }}
                              >
                                {renderMaterialIcon(transaction.icon, { fontSize: 'small' })}
                              </Box>

                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                  variant="body1"
                                  sx={{ color: 'var(--aura-on-surface)', fontWeight: 500 }}
                                  noWrap
                                >
                                  {transaction.merchant}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={0.75}
                                  sx={{ mt: 0.3, alignItems: 'center' }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'var(--aura-on-surface-variant)', fontSize: '13px' }}
                                  >
                                    {transaction.categoryLabel}
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: 4,
                                      height: 4,
                                      borderRadius: '999px',
                                      bgcolor: 'var(--aura-outline)',
                                    }}
                                  />
                                  <Stack
                                    direction="row"
                                    spacing={0.4}
                                    sx={{ alignItems: 'center' }}
                                  >
                                    {renderMaterialIcon(paymentMethodIconMap[transaction.paymentMethod], {
                                      sx: { fontSize: 14, color: 'var(--aura-on-surface-variant)' },
                                    })}
                                    <Typography
                                      variant="body2"
                                      sx={{ color: 'var(--aura-on-surface-variant)', fontSize: '13px' }}
                                    >
                                      {transaction.paymentMethodLabel}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </Box>

                              <Typography
                                sx={{
                                  fontFamily: 'var(--aura-data-mono, JetBrains Mono, ui-monospace, monospace)',
                                  color: isIncome ? 'var(--aura-secondary)' : 'var(--aura-on-surface)',
                                  fontWeight: isIncome ? 600 : 500,
                                }}
                              >
                                {formatMoney(transaction.money)}
                              </Typography>
                            </Stack>
                          </ListItemButton>

                          {index < group.transactions.length - 1 ? <Divider /> : null}
                        </Box>
                      )
                    })}
                  </List>
                </Box>
              ))
            )}
          </Paper>

          <Box sx={{ textAlign: 'center', pb: 2 }}>
            <Button sx={{ color: 'var(--aura-primary)' }}>Load more transactions</Button>
          </Box>
        </Stack>
      </PageContainer>

      <MobileBottomNav items={mobileNavigationItems} />
    </>
  )
}
