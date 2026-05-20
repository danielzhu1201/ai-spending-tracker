import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

import { AppTopBar } from '../../components/layout/AppTopBar'
import { MobileBottomNav } from '../../components/layout/MobileBottomNav'
import { PageContainer } from '../../components/layout/PageContainer'
import { mobileNavigationItems } from '../../config/navigation'

interface ComingSoonPageProps {
  screenLabel: string
  routeLabel: string
  showNavigation?: boolean
}

export function ComingSoonPage({
  screenLabel,
  routeLabel,
  showNavigation = true,
}: ComingSoonPageProps) {
  const navigate = useNavigate()

  return (
    <>
      {showNavigation ? <AppTopBar title="Aura Finance" /> : null}
      <PageContainer withBottomNavSpace={showNavigation}>
        <Stack
          spacing={2}
          sx={{
            mt: showNavigation ? 2 : 8,
            maxWidth: 680,
            mx: 'auto',
            p: 4,
            borderRadius: '16px',
            border: '1px solid var(--aura-outline-variant)',
            bgcolor: 'var(--aura-surface-container-lowest)',
            boxShadow: 'var(--aura-shadow-card)',
          }}
        >
          <AccessTimeRoundedIcon sx={{ color: 'var(--aura-on-surface-variant)' }} />
          <Typography variant="h2" sx={{ color: 'var(--aura-primary)' }}>
            {screenLabel} is queued for the next implementation step
          </Typography>
          <Typography sx={{ color: 'var(--aura-on-surface-variant)' }}>
            Route: <strong>{routeLabel}</strong>
          </Typography>
          <Typography sx={{ color: 'var(--aura-on-surface-variant)' }}>
            We kept this route active so shared atoms and navigation can be validated while we deliver one
            full screen at a time.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ alignSelf: 'flex-start' }}
          >
            Back to Dashboard
          </Button>
        </Stack>
      </PageContainer>
      {showNavigation ? <MobileBottomNav items={mobileNavigationItems} /> : null}
    </>
  )
}
