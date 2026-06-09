import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { useLocation, useNavigate } from 'react-router-dom'

import { APP_MOBILE_MAX_WIDTH } from '../../config/layout'
import type { NavigationItem } from '../../config/navigation'

interface MobileBottomNavProps {
  items: NavigationItem[]
}

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const currentIndex = Math.max(
    items.findIndex((item) => location.pathname.startsWith(item.path)),
    0,
  )

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: `min(100%, ${APP_MOBILE_MAX_WIDTH}px)`,
        display: 'block',
        zIndex: 1200,
      }}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(_, index: number) => {
          const next = items[index]
          if (next) {
            navigate(next.path)
          }
        }}
        sx={{
          bgcolor: 'var(--aura-surface)',
          py: 0.5,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            maxWidth: 'none',
            flex: '1 1 0',
            color: 'var(--aura-on-surface-variant)',
            borderRadius: '12px',
            mx: 0.25,
            px: 0.25,
            py: 0.75,
            overflow: 'hidden',
          },
          '& .MuiBottomNavigationAction-label': {
            whiteSpace: 'nowrap',
            fontSize: '0.68rem',
            lineHeight: 1.1,
            mt: 0.25,
          },
          '& .Mui-selected': {
            color: 'var(--aura-on-secondary-container)',
            bgcolor: 'var(--aura-secondary-container)',
          },
        }}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={<item.icon fontSize="small" />}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}
