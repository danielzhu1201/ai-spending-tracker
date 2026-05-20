import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { formatPercent } from '../../utils/formatters'

interface MetricPillProps {
  value: number
  direction: 'up' | 'down' | 'flat'
}

export function MetricPill({ value, direction }: MetricPillProps) {
  const Icon =
    direction === 'up'
      ? TrendingUpRoundedIcon
      : direction === 'down'
        ? TrendingDownRoundedIcon
        : TrendingFlatRoundedIcon

  const paletteByDirection =
    direction === 'up'
      ? {
          bg: 'var(--aura-error-container)',
          color: 'var(--aura-on-error-container)',
        }
      : direction === 'down'
        ? {
            bg: 'rgba(108, 248, 187, 0.35)',
            color: 'var(--aura-on-secondary-container)',
          }
        : {
            bg: 'var(--aura-surface-container)',
            color: 'var(--aura-on-surface-variant)',
          }

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: '999px',
        bgcolor: paletteByDirection.bg,
        color: paletteByDirection.color,
      }}
    >
      <Icon sx={{ fontSize: 16 }} />
      <Typography
        sx={{
          fontSize: 12,
          lineHeight: 1.2,
          fontWeight: 600,
          fontFamily: 'var(--aura-data-mono, JetBrains Mono, ui-monospace, monospace)',
        }}
      >
        {formatPercent(value)}
      </Typography>
    </Stack>
  )
}
