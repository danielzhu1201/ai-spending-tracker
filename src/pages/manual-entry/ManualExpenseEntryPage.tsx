import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'

import { CategoryChipGroup } from '../../components/forms/CategoryChipGroup'
import { LabeledInput } from '../../components/forms/LabeledInput'
import { AppTopBar } from '../../components/layout/AppTopBar'
import { MobileBottomNav } from '../../components/layout/MobileBottomNav'
import { PageContainer } from '../../components/layout/PageContainer'
import { mobileNavigationItems } from '../../config/navigation'
import {
  manualExpenseCategoryOptionsMock,
  manualExpenseDraftMock,
  manualExpenseTipMock,
} from '../../data/mock/futureScreens'
import type { TransactionCategory } from '../../types/domain'

export function ManualExpenseEntryPage() {
  const [draft, setDraft] = useState(manualExpenseDraftMock)

  const amountPlaceholder = useMemo(
    () => (draft.amount.length > 0 ? undefined : '0.00'),
    [draft.amount],
  )
  const dateValue = useMemo(() => {
    const parsed = dayjs(draft.transactionDate)
    return parsed.isValid() ? parsed : null
  }, [draft.transactionDate])

  return (
    <>
      <AppTopBar title="Aura Finance" />

      <PageContainer>
        <Stack spacing={3}>
          <Stack spacing={0.75}>
            <Typography variant="h2" sx={{ color: 'var(--aura-on-surface)' }}>
              Record Expense
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
              Stay mindful of your spending habits.
            </Typography>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: '16px',
              borderColor: 'var(--aura-outline-variant)',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
            >
              AMOUNT
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                mt: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.1,
                  fontWeight: 700,
                  color: 'var(--aura-primary-container)',
                }}
              >
                $
              </Typography>
              <Box
                component="input"
                type="number"
                value={draft.amount}
                placeholder={amountPlaceholder}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setDraft((current) => ({
                    ...current,
                    amount: event.target.value.slice(0, 8),
                  }))
                }}
                sx={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--aura-primary)',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  lineHeight: 1.1,
                  fontWeight: 700,
                  '&::placeholder': {
                    color: 'var(--aura-outline)',
                  },
                }}
              />
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            <Typography
              variant="caption"
              sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
            >
              CATEGORY
            </Typography>
            <CategoryChipGroup
              options={manualExpenseCategoryOptionsMock}
              selectedValue={draft.category}
              onChange={(nextCategory) => {
                setDraft((current) => ({
                  ...current,
                  category: nextCategory as TransactionCategory,
                }))
              }}
            />
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography
                variant="caption"
                sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
              >
                DATE
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dateValue}
                  onChange={(value: Dayjs | null) => {
                    setDraft((current) => ({
                      ...current,
                      transactionDate: value ? value.format('YYYY-MM-DD') : '',
                    }))
                  }}
                  format="MMM D, YYYY"
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'var(--aura-surface-container-lowest)',
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Stack>

            <LabeledInput
              label="NOTES (OPTIONAL)"
              placeholder="Dinner with colleagues"
              value={draft.note}
              multiline
              minRows={4}
              onChange={(event) => {
                setDraft((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }}
            />
          </Stack>

          <Button
            variant="contained"
            size="large"
            startIcon={<AddRoundedIcon />}
            sx={{
              height: 56,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            Add Expense
          </Button>

          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              border: '1px solid rgba(0, 108, 73, 0.12)',
              bgcolor: 'rgba(108, 248, 187, 0.2)',
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: 'var(--aura-secondary)',
                  color: 'var(--aura-on-secondary)',
                }}
              >
                <LightbulbRoundedIcon fontSize="small" />
              </Box>

              <Stack spacing={0.5}>
                <Typography
                  sx={{
                    color: 'var(--aura-on-secondary-container)',
                    fontWeight: 600,
                  }}
                >
                  {manualExpenseTipMock.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--aura-on-secondary-container)' }}>
                  {manualExpenseTipMock.message}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </PageContainer>

      <MobileBottomNav items={mobileNavigationItems} />
    </>
  )
}
