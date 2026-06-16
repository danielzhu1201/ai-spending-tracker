import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'

import { PageContainer } from '../../components/layout/PageContainer'
import type {
  InsightRange,
  InsightRangeOption,
} from '../../data/selectors/insightsSelectors'
import { apiEndpoints } from '../../lib/apiConfig'
import { authenticatedFetch } from '../../lib/authenticatedFetch'
import type { InsightCard } from '../../types/domain'
import { AskAuraFab } from './components/AskAuraFab'
import { InsightObservationCard } from './components/InsightObservationCard'
import { InsightRangeTabs } from './components/InsightRangeTabs'

const insightRanges: InsightRangeOption[] = [
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
]

function InsightLoadingState() {
  return (
    <Stack spacing={2}>
      {Array.from({ length: 2 }, (_, index) => (
        <Stack
          key={index}
          spacing={2}
          sx={{
            p: 2.25,
            borderRadius: '12px',
            border: '1px solid var(--aura-outline-variant)',
            bgcolor: 'var(--aura-surface-container-lowest)',
            boxShadow: 'var(--aura-shadow-card)',
          }}
        >
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rounded" width={76} height={28} sx={{ borderRadius: '999px' }} />
          </Stack>
          <Stack spacing={1}>
            <Skeleton variant="text" width="46%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="82%" />
          </Stack>
        </Stack>
      ))}
    </Stack>
  )
}

export function InsightsPage() {
  const [selectedRange, setSelectedRange] = useState<InsightRange>('monthly')
  const [insights, setInsights] = useState<InsightCard[]>([])
  const [isLoadingInsights, setIsLoadingInsights] = useState(true)
  const [insightsError, setInsightsError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function loadInsights() {
      try {
        setIsLoadingInsights(true)
        setInsightsError(null)

        const response = await authenticatedFetch(
          `${apiEndpoints.insights}?range=${selectedRange}`,
          {
            signal: abortController.signal,
          },
        )

        if (!response.ok) {
          throw new Error(`Insights request failed: ${response.status}`)
        }

        const data = (await response.json()) as InsightCard[]
        setInsights(data)
      } catch (error) {
        if (abortController.signal.aborted) {
          return
        }

        setInsightsError(
          error instanceof Error ? error.message : 'Unable to load insights.',
        )
        setInsights([])
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingInsights(false)
        }
      }
    }

    void loadInsights()

    return () => {
      abortController.abort()
    }
  }, [selectedRange])

  return (
    <>
      <PageContainer>
        <Stack spacing={3}>
          <Stack spacing={2}>
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
              >
                FINANCIAL OVERVIEW
              </Typography>
              <Typography variant="h2" sx={{ color: 'var(--aura-primary)' }}>
                Smart Insights
              </Typography>
            </Stack>
            <InsightRangeTabs
              ranges={insightRanges}
              value={selectedRange}
              onChange={setSelectedRange}
            />
          </Stack>

          {isLoadingInsights ? (
            <InsightLoadingState />
          ) : insightsError ? (
            <Stack spacing={1} sx={{ p: 2.25 }}>
              <Typography variant="body1" sx={{ color: 'var(--aura-primary)' }}>
                Unable to load insights
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                {insightsError}
              </Typography>
            </Stack>
          ) : insights.length === 0 ? (
            <Stack spacing={1} sx={{ p: 2.25 }}>
              <Typography variant="body1" sx={{ color: 'var(--aura-primary)' }}>
                No insights yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                Add more transactions to unlock spending observations.
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {insights.map((insight) => (
                <InsightObservationCard key={insight.id} insight={insight} />
              ))}
            </Stack>
          )}
        </Stack>
      </PageContainer>

      <AskAuraFab />
    </>
  )
}
