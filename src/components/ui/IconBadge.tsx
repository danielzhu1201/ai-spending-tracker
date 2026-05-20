import Box from '@mui/material/Box'
import type { ReactNode } from 'react'

interface IconBadgeProps {
  children: ReactNode
  tone?: 'default' | 'positive'
}

export function IconBadge({ children, tone = 'default' }: IconBadgeProps) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '12px',
        display: 'grid',
        placeItems: 'center',
        bgcolor:
          tone === 'positive'
            ? 'rgba(108, 248, 187, 0.35)'
            : 'var(--aura-surface-container)',
        color:
          tone === 'positive'
            ? 'var(--aura-on-secondary-container)'
            : 'var(--aura-primary-container)',
      }}
    >
      {children}
    </Box>
  )
}
