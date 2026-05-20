import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import { useLocation, useNavigate } from 'react-router-dom'

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
        left: 0,
        right: 0,
        display: { xs: 'block', md: 'none' },
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
            minWidth: 64,
            color: 'var(--aura-on-surface-variant)',
            borderRadius: '12px',
            mx: 0.5,
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
