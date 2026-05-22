import { createTheme } from '@mui/material/styles'

import { auraTokens } from './auraTokens'

export const auraTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: auraTokens.colors.primary,
      contrastText: auraTokens.colors.onPrimary,
    },
    secondary: {
      main: auraTokens.colors.secondary,
      contrastText: auraTokens.colors.onSecondary,
    },
    error: {
      main: auraTokens.colors.error,
      contrastText: auraTokens.colors.onError,
    },
    background: {
      default: auraTokens.colors.background,
      paper: auraTokens.colors.surfaceContainerLowest,
    },
    text: {
      primary: auraTokens.colors.onSurface,
      secondary: auraTokens.colors.onSurfaceVariant,
    },
    divider: auraTokens.colors.outlineVariant,
  },
  typography: {
    fontFamily: auraTokens.typography.fontFamily,
    h1: auraTokens.typography.headlineLg,
    h2: auraTokens.typography.titleMd,
    h3: auraTokens.typography.titleMd,
    body1: auraTokens.typography.bodyLg,
    body2: auraTokens.typography.bodySm,
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0',
    },
    caption: {
      ...auraTokens.typography.labelCaps,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: auraTokens.radius.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
          backgroundColor: auraTokens.colors.background,
          color: auraTokens.colors.onSurface,
        },
        '#root': {
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: auraTokens.radius.md,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${auraTokens.colors.outlineVariant}`,
          boxShadow: auraTokens.shadows.card,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: auraTokens.radius.md,
          boxShadow: auraTokens.shadows.elevated,
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          borderTop: `1px solid ${auraTokens.colors.outlineVariant}`,
          borderTopLeftRadius: auraTokens.radius.lg,
          borderTopRightRadius: auraTokens.radius.lg,
        },
      },
    },
  },
})

export const auraCssVariables = {
  '--aura-surface': auraTokens.colors.surface,
  '--aura-surface-container-lowest': auraTokens.colors.surfaceContainerLowest,
  '--aura-surface-container-low': auraTokens.colors.surfaceContainerLow,
  '--aura-surface-container': auraTokens.colors.surfaceContainer,
  '--aura-surface-container-high': auraTokens.colors.surfaceContainerHigh,
  '--aura-surface-container-highest': auraTokens.colors.surfaceContainerHighest,
  '--aura-on-surface': auraTokens.colors.onSurface,
  '--aura-on-surface-variant': auraTokens.colors.onSurfaceVariant,
  '--aura-outline': auraTokens.colors.outline,
  '--aura-outline-variant': auraTokens.colors.outlineVariant,
  '--aura-primary': auraTokens.colors.primary,
  '--aura-on-primary': auraTokens.colors.onPrimary,
  '--aura-primary-container': auraTokens.colors.primaryContainer,
  '--aura-on-primary-container': auraTokens.colors.onPrimaryContainer,
  '--aura-secondary': auraTokens.colors.secondary,
  '--aura-on-secondary': auraTokens.colors.onSecondary,
  '--aura-secondary-container': auraTokens.colors.secondaryContainer,
  '--aura-on-secondary-container': auraTokens.colors.onSecondaryContainer,
  '--aura-error': auraTokens.colors.error,
  '--aura-error-container': auraTokens.colors.errorContainer,
  '--aura-on-error-container': auraTokens.colors.onErrorContainer,
  '--aura-background': auraTokens.colors.background,
  '--aura-on-background': auraTokens.colors.onBackground,
  '--aura-radius-default': `${auraTokens.radius.default}px`,
  '--aura-radius-md': `${auraTokens.radius.md}px`,
  '--aura-radius-lg': `${auraTokens.radius.lg}px`,
  '--aura-shadow-card': auraTokens.shadows.card,
  '--aura-shadow-elevated': auraTokens.shadows.elevated,
  '--aura-shadow-topbar': auraTokens.shadows.topBar,
  '--aura-data-mono': auraTokens.typography.dataMonoFamily,
} as const
