'use client'

import React, { useEffect, useMemo } from 'react'
import { useGridApiRef } from '@mui/x-data-grid'
import { Search as SearchIcon } from '@mui/icons-material'

import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import DataTable from '@/components/DataTable'
import useRecord from './hooks/useRecord'
import CustomColumn from './components/CustomColumn'

export default function RecordPage() {
  const recordDataGridRef = useGridApiRef()
  const {
    mockData,
    handleRowEditStop,
    handleEditClick,
    handleSaveClick,
    handleDeleteClick,
    handleCancelClick,
    processRowUpdate,
    handleRowModesModelChange,
    rowModesModel,
    prepareCategorySearch,
    categorySearch,
    handleChange,
    searchCriteria,
  } = useRecord()

  const columns = useMemo(
    () =>
      CustomColumn({
        cancle: handleCancelClick,
        edit: handleEditClick,
        save: handleSaveClick,
        remove: handleDeleteClick,
        rowModesModel,
      }),
    []
  )

  useEffect(() => {
    prepareCategorySearch(columns)
  }, [columns])

  return (
    <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
      <Box flexDirection={'row'} display={'flex'} gap={2} padding={2}>
        <Autocomplete
          disablePortal
          options={categorySearch?.map(item => item.label)}
          onChange={(event, newValue) => handleChange('category', newValue)}
          value={searchCriteria.category}
          sx={{ width: 300 }}
          renderInput={params => <TextField {...params} label='category' />}
        />
        <TextField
          name='keyword'
          label='keyword'
          value={searchCriteria.keyword}
          onChange={e => handleChange('keyword', e.target.value)}
        />
        <Box justifyContent={'center'} alignContent={'center'}>
          <Button aria-label='search' variant='contained' size='small'>
            <SearchIcon />
          </Button>
        </Box>
      </Box>
      <Divider sx={{ borderWidth: 1, borderColor: theme => theme.palette.primary.light }} />
      <Box marginTop={2} flex={1}>
        <DataTable
          data={mockData}
          columns={columns}
          editMode='row'
          apiref={recordDataGridRef}
          paginationModel={{ pageSize: 25, page: 0 }}
          onSelected={selectedRow => console.log(selectedRow)}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          rowModesModel={rowModesModel}
          sx={{ height: '100%' }}
        />
      </Box>
    </Box>
  )
}
