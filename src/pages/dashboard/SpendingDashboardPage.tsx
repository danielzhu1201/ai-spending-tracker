import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { AppTopBar } from '../../components/layout/AppTopBar'
import { MobileBottomNav } from '../../components/layout/MobileBottomNav'
import { PageContainer } from '../../components/layout/PageContainer'
import { GlassCard } from '../../components/ui/GlassCard'
import { MetricPill } from '../../components/ui/MetricPill'
import { PrimaryFab } from '../../components/ui/PrimaryFab'
import { TransactionGroupList } from '../../components/transactions/TransactionGroupList'
import { mobileNavigationItems } from '../../config/navigation'
import { dashboardApiResponseMock } from '../../data/mock/dashboardApi'
import {
  selectDashboardSummary,
  selectDashboardTransactionGroups,
} from '../../data/selectors/dashboardSelectors'
import { formatMoney } from '../../utils/formatters'

const summary = selectDashboardSummary(dashboardApiResponseMock)
const transactionGroups = selectDashboardTransactionGroups(dashboardApiResponseMock)

export function SpendingDashboardPage() {
  return (
    <>
      <AppTopBar title="Aura Finance" />

      <PageContainer>
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
            }}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
              >
                MONTHLY OVERVIEW
              </Typography>
              <Typography variant="h2" sx={{ color: 'var(--aura-primary)' }}>
                Spending Dashboard
              </Typography>
            </Stack>
          </Stack>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <GlassCard className="md:col-span-2">
              <Stack spacing={3}>
                <Stack spacing={1.5}>
                  <Typography variant="caption" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                    MONTHLY SPENDING • {summary.monthLabel}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '2rem', md: '3rem' },
                        fontWeight: 700,
                        lineHeight: 1.1,
                        color: 'var(--aura-primary)',
                      }}
                    >
                      {formatMoney(summary.monthlySpend)}
                    </Typography>
                    <MetricPill
                      value={summary.trend.value}
                      direction={summary.trend.direction}
                    />
                  </Stack>
                </Stack>

                <div className="flex h-32 items-end gap-2">
                  {summary.chartBars.map((height, index) => (
                    <div
                      key={`${height}-${index}`}
                      className={
                        index === 4
                          ? 'flex-1 rounded-t-lg bg-[var(--aura-primary)] transition-all'
                          : 'flex-1 rounded-t-lg bg-[var(--aura-surface-container-high)] transition-all'
                      }
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </Stack>
            </GlassCard>

            <GlassCard>
              <Stack spacing={2}>
                <Typography variant="caption" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                  MONTHLY COMPARISON
                </Typography>

                <Stack spacing={1.25}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                      Last Month
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'var(--aura-data-mono, JetBrains Mono, ui-monospace, monospace)',
                      }}
                    >
                      {formatMoney(summary.comparison.previousMonth)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      height: 8,
                      borderRadius: 99,
                      bgcolor: 'var(--aura-surface-container-low)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'var(--aura-outline)',
                      },
                    }}
                  />
                </Stack>

                <Stack spacing={1.25}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                      Current
                    </Typography>
                    <Typography
                      sx={{
                        color: 'var(--aura-secondary)',
                        fontFamily: 'var(--aura-data-mono, JetBrains Mono, ui-monospace, monospace)',
                      }}
                    >
                      {formatMoney(summary.comparison.currentMonth)}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={summary.comparison.progressPct}
                    sx={{
                      height: 8,
                      borderRadius: 99,
                      bgcolor: 'var(--aura-surface-container-low)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'var(--aura-secondary)',
                      },
                    }}
                  />
                </Stack>

                <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                  {summary.highlightText}
                </Typography>
              </Stack>
            </GlassCard>
          </div>

          <Stack spacing={1.5}>
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h3" sx={{ color: 'var(--aura-primary)' }}>
                Recent Transactions
              </Typography>
              <Button
                size="small"
                sx={{ color: 'var(--aura-secondary)', fontWeight: 600 }}
              >
                View all
              </Button>
            </Stack>

            <TransactionGroupList groups={transactionGroups} />
          </Stack>
        </Stack>
      </PageContainer>

      <PrimaryFab icon={<DocumentScannerRoundedIcon />} label="Scan Receipt" />
      <MobileBottomNav items={mobileNavigationItems} />
    </>
  )
}
