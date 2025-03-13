import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid'
import React from 'react'

export default function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton
        slotProps={{ button: { sx: { color: theme => theme.palette.text.primary } } }}
      />
      {/* <GridToolbarDensitySelector
        slotProps={{ button: { sx: { color: theme => theme.palette.text.primary } } }}
      /> */}
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}
