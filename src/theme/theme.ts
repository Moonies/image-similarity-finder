import { createTheme, Theme } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

export const getTheme = (mode: ThemeMode): Theme =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: mode === 'light' ? '#4791DB' : '#7986cb',
        main: mode === 'light' ? '#1976D2' : '#3f51b5',
        dark: mode === 'light' ? '#115293' : '#303f9f',
      },
      secondary: {
        light: mode === 'light' ? '#F73378' : '#ff4081',
        main: mode === 'light' ? '#F50057' : '#f50057',
        dark: mode === 'light' ? '#AB003C' : '#c51162',
      },
      background: {
        default: mode === 'light' ? '#fff' : '#202020',
        paper: mode === 'light' ? '#f4f4f4' : '#393939',
      },
      error: {
        light: '#ef5350',
        main: '#D32F2F',
        dark: '#C62828',
      },
      warning: {
        light: '#FF9800',
        main: '#ED6C02',
        dark: '#E65100',
      },
      success: {
        light: '#4CAF50',
        main: '#2E7D32',
        dark: '#1B5E20',
      },
      info: {
        light: '#03a9f4',
        main: '#0288D1',
        dark: '#01579B',
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
