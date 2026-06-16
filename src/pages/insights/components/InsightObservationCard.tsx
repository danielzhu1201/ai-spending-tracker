import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { renderMaterialIcon } from '../../../components/icons/materialIconMap'
import { IconBadge } from '../../../components/ui/IconBadge'
import type { InsightCard } from '../../../types/domain'

interface InsightObservationCardProps {
  insight: InsightCard
}

export function InsightObservationCard({ insight }: InsightObservationCardProps) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: 2.25,
        borderRadius: '12px',
        border: '1px solid var(--aura-outline-variant)',
        bgcolor: 'var(--aura-surface-container-lowest)',
        boxShadow: 'var(--aura-shadow-card)',
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <IconBadge>
          {renderMaterialIcon(insight.icon, { fontSize: 'small' })}
        </IconBadge>
      </Stack>

      <Stack spacing={0.75}>
        <Typography variant="h3" sx={{ color: 'var(--aura-primary)' }}>
          {insight.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
          {insight.description}
        </Typography>
      </Stack>
    </Stack>
  )
}
