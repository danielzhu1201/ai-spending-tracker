import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useLocation } from 'react-router-dom'

import { CategoryChipGroup } from '../../components/forms/CategoryChipGroup'
import { LabeledInput } from '../../components/forms/LabeledInput'
import { PageContainer } from '../../components/layout/PageContainer'
import { apiEndpoints } from '../../lib/apiConfig'
import { authenticatedFetch } from '../../lib/authenticatedFetch'
import type { FilterOption, TransactionCategory, TransactionInfo } from '../../types/domain'

interface ManualEntryLocationState {
  receiptTransaction?: TransactionInfo
}

type SaveToast = {
  message: string
  severity: 'success' | 'error'
}

const defaultManualExpenseDraft: TransactionInfo = {
  amount: '',
  category: 'food-dining',
  transactionDate: '',
  note: '',
}

const manualExpenseCategoryOptions: FilterOption[] = [
  {
    id: 'manual-category-dining',
    label: 'Dining',
    value: 'food-dining',
    icon: 'restaurant',
    group: 'category',
    selected: true,
  },
  {
    id: 'manual-category-shopping',
    label: 'Shopping',
    value: 'shopping',
    icon: 'shopping_bag',
    group: 'category',
  },
  {
    id: 'manual-category-transport',
    label: 'Transport',
    value: 'transport',
    icon: 'commute',
    group: 'category',
  },
  {
    id: 'manual-category-bills',
    label: 'Bills',
    value: 'housing',
    icon: 'home',
    group: 'category',
  },
  {
    id: 'manual-category-other',
    label: 'Other',
    value: 'other',
    icon: 'more_horiz',
    group: 'category',
  },
]

const manualExpenseTip = {
  title: 'Spending Tip',
  message:
    "You've stayed within your daily budget for 5 days straight. Keeping this entry under $40 will maintain your streak!",
}

function createManualExpenseDraft(initial?: TransactionInfo): TransactionInfo {
  return {
    ...defaultManualExpenseDraft,
    ...initial,
    transactionDate: dayjs().format('YYYY-MM-DD'),
    ...(initial?.transactionDate ? { transactionDate: initial.transactionDate } : {}),
  }
}

export function ManualExpenseEntryPage() {
  const location = useLocation()
  const receiptTransaction = (location.state as ManualEntryLocationState | null)
    ?.receiptTransaction
  const [draft, setDraft] = useState<TransactionInfo>(
    () => createManualExpenseDraft(receiptTransaction),
  )
  const [isSavingExpense, setIsSavingExpense] = useState(false)
  const [saveToast, setSaveToast] = useState<SaveToast | null>(null)

  const amountPlaceholder = useMemo(
    () => (draft.amount.length > 0 ? undefined : '0.00'),
    [draft.amount],
  )
  const dateValue = useMemo(() => {
    const parsed = dayjs(draft.transactionDate)
    return parsed.isValid() ? parsed : null
  }, [draft.transactionDate])

  const addExpense = async () => {
    if (isSavingExpense) {
      return
    }

    setIsSavingExpense(true)
    setSaveToast(null)

    try {
      const response = await authenticatedFetch(apiEndpoints.transactions, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft),
      })

      if (!response.ok) {
        let message = 'Unable to save expense.'

        try {
          const errorBody = (await response.json()) as { detail?: string }
          message = errorBody.detail ?? message
        } catch {
          message = response.statusText || message
        }

        throw new Error(message)
      }

      setDraft(createManualExpenseDraft())
      setSaveToast({
        message: 'Transaction added successfully.',
        severity: 'success',
      })
    } catch (error) {
      setSaveToast({
        message: error instanceof Error ? error.message : 'Unable to save expense.',
        severity: 'error',
      })
    } finally {
      setIsSavingExpense(false)
    }
  }

  return (
    <>
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
                disabled={isSavingExpense}
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
              options={manualExpenseCategoryOptions}
              selectedValue={draft.category}
              onChange={(nextCategory) => {
                if (isSavingExpense) {
                  return
                }

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
                  disabled={isSavingExpense}
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
              disabled={isSavingExpense}
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
            startIcon={isSavingExpense ? undefined : <AddRoundedIcon />}
            disabled={isSavingExpense}
            onClick={() => {
              void addExpense()
            }}
            sx={{
              height: 56,
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            {isSavingExpense ? (
              <CircularProgress size={24} sx={{ color: '#ffffff' }} />
            ) : (
              'Add Expense'
            )}
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
                  {manualExpenseTip.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--aura-on-secondary-container)' }}>
                  {manualExpenseTip.message}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </PageContainer>

      <Snackbar
        open={Boolean(saveToast)}
        autoHideDuration={4000}
        onClose={() => setSaveToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {saveToast ? (
          <Alert
            severity={saveToast.severity}
            variant="filled"
            onClose={() => setSaveToast(null)}
            sx={{ width: '100%' }}
          >
            {saveToast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}
