import Card from '@mui/material/Card'
import type { PropsWithChildren } from 'react'

import { cn } from '../../utils/cn'

interface GlassCardProps extends PropsWithChildren {
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <Card
      className={cn('glass-card p-6', className)}
      sx={{
        border: '1px solid var(--aura-outline-variant)',
      }}
    >
      {children}
    </Card>
  )
}
