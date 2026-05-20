import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={0.5}>
        <Typography
          variant="caption"
          sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
        >
          {subtitle}
        </Typography>
        <Typography variant="h2" sx={{ color: 'var(--aura-primary)' }}>
          {title}
        </Typography>
      </Stack>
      {action}
    </Stack>
  )
}
