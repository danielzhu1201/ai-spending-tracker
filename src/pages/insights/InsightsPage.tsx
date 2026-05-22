import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'

import { PageContainer } from '../../components/layout/PageContainer'
import { insightsApiResponseMock } from '../../data/mock/insightsApi'
import {
  selectInsightsPageViewModel,
  type InsightRange,
} from '../../data/selectors/insightsSelectors'
import { AskAuraFab } from './components/AskAuraFab'
import { InsightObservationCard } from './components/InsightObservationCard'
import { InsightRangeTabs } from './components/InsightRangeTabs'

const insightsViewModel = selectInsightsPageViewModel(insightsApiResponseMock)

export function InsightsPage() {
  const [selectedRange, setSelectedRange] = useState<InsightRange>(
    insightsViewModel.selectedRange,
  )
  const activeView = insightsViewModel.views[selectedRange]

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
              ranges={insightsViewModel.ranges}
              value={selectedRange}
              onChange={setSelectedRange}
            />
          </Stack>

          <Stack spacing={2}>
            {activeView.observations.map((insight) => (
              <InsightObservationCard key={insight.id} insight={insight} />
            ))}
          </Stack>
        </Stack>
      </PageContainer>

      <AskAuraFab />
    </>
  )
}
