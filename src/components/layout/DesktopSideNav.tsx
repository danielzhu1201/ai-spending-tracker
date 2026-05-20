import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useLocation, useNavigate } from 'react-router-dom'

import type { NavigationItem } from '../../config/navigation'

interface DesktopSideNavProps {
  items: NavigationItem[]
}

export function DesktopSideNav({ items }: DesktopSideNavProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        top: 96,
        left: 32,
        width: 280,
        display: { xs: 'none', lg: 'block' },
      }}
    >
      <Stack
        spacing={1}
        sx={{
          p: 2,
          borderRadius: '16px',
          bgcolor: 'var(--aura-surface-container-low)',
          border: '1px solid var(--aura-outline-variant)',
        }}
      >
        {items.map((item) => {
          const selected = location.pathname.startsWith(item.path)

          return (
            <ButtonBase
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                width: '100%',
                px: 2,
                py: 1.5,
                borderRadius: '12px',
                justifyContent: 'flex-start',
                bgcolor: selected
                  ? 'var(--aura-primary)'
                  : 'transparent',
                color: selected
                  ? 'var(--aura-on-primary)'
                  : 'var(--aura-on-surface-variant)',
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                }}
              >
                <item.icon fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: selected ? 600 : 500,
                  }}
                >
                  {item.label}
                </Typography>
              </Stack>
            </ButtonBase>
          )
        })}
      </Stack>
    </Box>
  )
}
