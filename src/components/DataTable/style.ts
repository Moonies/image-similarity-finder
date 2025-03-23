import { styled, alpha } from '@mui/material/styles'
import { Box } from '@mui/material'
import { DataGrid, gridClasses } from '@mui/x-data-grid'

const DataGridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  // height: 400,
  '& .MuiDataGrid-root': {
    border: `2px solid ${theme.palette.primary.light}`,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-footerContainer': {
    borderTop: `2px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}))
const ODD_OPACITY = 0.2
const StyledStripedDataGrid = styled(DataGrid)(({ theme }) => ({
  fontSize: 14,
  // fontWeight: 'bold',
  [`.MuiTablePagination-root`]: {
    overflow: 'hidden',
  },
  [`.${gridClasses.cell}.right`]: {
    textAlign: 'right',
  },
  [`.${gridClasses.cell}.center`]: {
    textAlign: 'center',
  },
  '& .MuiDataGrid-columnHeaders': {
    color: theme.palette.text.primary,
    borderBottom: `4px solid ${theme.palette.divider}`,
  },
  [`& .${gridClasses.row}.odd`]: {
    backgroundColor: theme.palette.mode === 'light' ? 'white' : '#374151',

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.primary.main
          : alpha(theme.palette.primary.dark, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      border: theme.palette.mode === 'light' ? '' : '1px solid white',
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : '#7986cb',

    '&:hover': {
      backgroundColor:
        theme.palette.mode === 'light'
          ? alpha(theme.palette.primary.main, ODD_OPACITY)
          : alpha('#7986cb', 0.8),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      border: theme.palette.mode === 'light' ? '' : '1px solid white',
      '&:hover': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}))
export { DataGridContainer, StyledStripedDataGrid }
