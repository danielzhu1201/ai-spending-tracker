import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface FilterChipProps {
  label: string
  selected?: boolean
  icon?: ReactNode
  onClick?: () => void
}

export function FilterChip({ label, selected, icon, onClick }: FilterChipProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        px: 1.75,
        py: 1,
        borderRadius: '999px',
        border: '1px solid var(--aura-outline-variant)',
        bgcolor: selected ? 'var(--aura-primary)' : 'var(--aura-surface-container-lowest)',
        color: selected ? 'var(--aura-on-primary)' : 'var(--aura-on-surface-variant)',
      }}
    >
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
        }}
      >
        {icon}
        <Typography variant="body2">{label}</Typography>
      </Stack>
    </ButtonBase>
  )
}
