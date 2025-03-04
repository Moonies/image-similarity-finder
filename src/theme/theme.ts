import { createTheme, PaletteOptions, Theme, ThemeOptions } from '@mui/material/styles'

type ThemeMode = 'light' | 'dark'

const themeOption: ThemeOptions = {
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minWidth: 80,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#ffffff29',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: props => ({
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor:
                props.theme.palette.mode === 'dark'
                  ? props.theme.palette.text.primary
                  : props.theme.palette.primary.main,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color:
              props.theme.palette.mode === 'dark'
                ? props.theme.palette.text.primary
                : props.theme.palette.primary.main,
          },
        }),
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '24px !important',
          margin: '16px',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: props => ({
          '&.Mui-checked': {
            color:
              props.theme.palette.mode === 'dark'
                ? '#5cff70' //#5cff70
                : props.theme.palette.primary.main,
          },
        }),
      },
    },
    // Add more component overrides
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  // Additional theme customizations
}

const lightTheme: PaletteOptions = {
  primary: {
    light: '#4791DB',
    main: '#1976D2',
    dark: '#115293',
  },
  secondary: {
    light: '#F73378',
    main: '#F50057',
    dark: '#AB003C',
  },
  background: {
    default: '#ffffff',
    paper: '#f4f4f4',
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
  divider: 'rgba(0, 0, 0, 0.12)',
}

const darkTheme: PaletteOptions = {
  primary: {
    light: '#7986cb',
    main: '#3f51b5',
    dark: '#303f9f',
  },
  secondary: {
    light: '#ff4081',
    main: '#f50057',
    dark: '#c51162',
  },
  background: {
    default: '#1A202C',
    paper: '#2D3748',
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
  divider: 'rgba(255, 255, 255, 0.12)',
}

export const getTheme = (mode: ThemeMode): Theme =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? lightTheme : darkTheme),
    },
    ...themeOption,
  })

export type { ThemeMode }
