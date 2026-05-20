import Box from '@mui/material/Box'
import type { PropsWithChildren } from 'react'

import { APP_MOBILE_MAX_WIDTH } from '../../config/layout'
import { cn } from '../../utils/cn'

interface PageContainerProps extends PropsWithChildren {
  className?: string
  withBottomNavSpace?: boolean
}

export function PageContainer({
  children,
  className,
  withBottomNavSpace = true,
}: PageContainerProps) {
  return (
    <Box
      component="main"
      className={cn(
        'mx-auto w-full px-4 pt-20',
        withBottomNavSpace ? 'pb-28' : 'pb-10',
        className,
      )}
      sx={{
        maxWidth: `${APP_MOBILE_MAX_WIDTH}px`,
      }}
    >
      {children}
    </Box>
  )
}
