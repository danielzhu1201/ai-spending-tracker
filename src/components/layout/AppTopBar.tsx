import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import { APP_MOBILE_MAX_WIDTH } from '../../config/layout'

interface AppTopBarProps {
  title: string
  onNotificationClick?: () => void
}

export function AppTopBar({ title, onNotificationClick }: AppTopBarProps) {
  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        width: `min(100%, ${APP_MOBILE_MAX_WIDTH}px)`,
        left: '50%',
        transform: 'translateX(-50%)',
        borderBottom: '1px solid var(--aura-outline-variant)',
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(247, 249, 251, 0.85)',
        boxShadow: 'var(--aura-shadow-topbar)',
      }}
    >
      <Toolbar
        sx={{
          maxWidth: `${APP_MOBILE_MAX_WIDTH}px`,
          width: '100%',
          mx: 'auto',
          px: 2,
          minHeight: '64px',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            color: 'var(--aura-primary)',
          }}
        >
          {title}
        </Typography>
        <IconButton
          color="primary"
          aria-label="notifications"
          onClick={onNotificationClick}
          sx={{
            borderRadius: '999px',
            '&:hover': {
              backgroundColor: 'var(--aura-surface-container-low)',
            },
          }}
        >
          <NotificationsRoundedIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
