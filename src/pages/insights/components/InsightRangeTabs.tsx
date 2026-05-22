import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import type { InsightRange, InsightRangeOption } from '../../../data/selectors/insightsSelectors'

interface InsightRangeTabsProps {
  ranges: InsightRangeOption[]
  value: InsightRange
  onChange: (value: InsightRange) => void
}

export function InsightRangeTabs({ ranges, value, onChange }: InsightRangeTabsProps) {
  return (
    <Stack
      direction="row"
      sx={{
        width: 'fit-content',
        p: 0.5,
        borderRadius: '12px',
        bgcolor: 'var(--aura-surface-container)',
      }}
    >
      {ranges.map((range) => {
        const selected = range.id === value

        return (
          <ButtonBase
            key={range.id}
            onClick={() => {
              onChange(range.id)
            }}
            sx={{
              px: 1.75,
              py: 0.8,
              minWidth: 82,
              borderRadius: '10px',
              bgcolor: selected ? 'var(--aura-surface-container-lowest)' : 'transparent',
              color: selected ? 'var(--aura-primary)' : 'var(--aura-on-surface-variant)',
              boxShadow: selected ? 'var(--aura-shadow-card)' : 'none',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: selected ? 600 : 500 }}>
              {range.label}
            </Typography>
          </ButtonBase>
        )
      })}
    </Stack>
  )
}
