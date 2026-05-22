import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import type { ReactNode } from 'react'

import { APP_MOBILE_MAX_WIDTH } from '../../config/layout'

interface PrimaryFabProps {
  icon: ReactNode
  label: string
  onClick?: () => void
}

export function PrimaryFab({ icon, label, onClick }: PrimaryFabProps) {
  return (
    <Tooltip title={label}>
      <Fab
        color="secondary"
        onClick={onClick}
        sx={{
          position: 'fixed',
          right: `calc((100vw - min(100vw, ${APP_MOBILE_MAX_WIDTH}px)) / 2 + 24px)`,
          bottom: 92,
          zIndex: 1250,
          width: 56,
          height: 56,
          color: 'var(--aura-on-secondary)',
          bgcolor: 'var(--aura-secondary)',
          '&:hover': {
            bgcolor: 'var(--aura-on-secondary-container)',
          },
        }}
      >
        {icon}
      </Fab>
    </Tooltip>
  )
}
