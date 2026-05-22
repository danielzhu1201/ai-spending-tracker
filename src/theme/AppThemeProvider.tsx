import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import type { PropsWithChildren } from 'react'

import { auraCssVariables, auraTheme } from './auraTheme'

export function AppThemeProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={auraTheme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': auraCssVariables,
        }}
      />
      {children}
    </ThemeProvider>
  )
}
