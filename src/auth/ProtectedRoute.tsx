import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { PageContainer } from '../components/layout/PageContainer'
import { useAuth } from './AuthContext'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation()
  const { isAuthenticated, isAuthReady } = useAuth()

  if (!isAuthReady) {
    return (
      <PageContainer>
        <Stack sx={{ alignItems: 'center', py: 8 }}>
          <CircularProgress sx={{ color: 'var(--aura-primary)' }} />
        </Stack>
      </PageContainer>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
