import Box from '@mui/material/Box'
import type { PropsWithChildren } from 'react'

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
        'mx-auto w-full max-w-7xl px-4 md:px-8 pt-20',
        withBottomNavSpace ? 'pb-28 md:pb-10' : 'pb-10',
        className,
      )}
    >
      {children}
    </Box>
  )
}
