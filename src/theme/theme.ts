import { createTheme, Theme } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

export const getTheme = (mode: ThemeMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#ff4081',
      },
      background: {
        default: mode === 'light' ? '#fff' : '#121212',
        paper: mode === 'light' ? '#f4f4f4' : '#1e1e1e',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
      // Add more component overrides
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    // Additional theme customizations
  })

export type { ThemeMode }
