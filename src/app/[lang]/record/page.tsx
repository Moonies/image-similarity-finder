'use client'

import { useEffect, useMemo } from 'react'
import { useGridApiRef } from '@mui/x-data-grid'
import { Search as SearchIcon } from '@mui/icons-material'
import { Autocomplete, Box, Button, Divider, TextField } from '@mui/material'
import DataTable from '@/components/DataTable'
import useRecord from './hooks/useRecord'
import CustomColumn from './components/CustomColumn'
import { useTranslation } from 'react-i18next'
import PageTransition from '@/components/PageTransition'

export default function RecordPage() {
  const { t } = useTranslation('record-page')
  const recordDataGridRef = useGridApiRef()

  const {
    drawingList,
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
    handleSearch,
    handlePaginationModelChange,
    totalRows,
    paginationModel,
    handleCache,
  } = useRecord()

  const columns = useMemo(
    () =>
      CustomColumn({
        cancle: handleCancelClick,
        edit: handleEditClick,
        save: handleSaveClick,
        remove: handleDeleteClick,
        rowModesModel,
        t: t,
      }),
    [rowModesModel, t, handleCancelClick, handleEditClick, handleSaveClick, handleDeleteClick]
  )

  useEffect(() => {
    console.log('mount')
    handleCache()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    prepareCategorySearch(columns)
  }, [columns, prepareCategorySearch])

  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box flexDirection={'row'} display={'flex'} gap={2} padding={2}>
          <Autocomplete
            disablePortal
            options={categorySearch?.map(item => item.label)}
            onChange={(event, newValue) => handleChange('category', newValue)}
            value={searchCriteria.category}
            sx={{ width: 300 }}
            renderInput={params => <TextField {...params} label={t('category')} />}
          />
          <TextField
            name='keyword'
            label={t('keyword')}
            value={searchCriteria.keyword}
            onChange={e => handleChange('keyword', e.target.value)}
          />
          <Box justifyContent={'center'} alignContent={'center'}>
            <Button aria-label='search' variant='contained' size='small' onClick={handleSearch}>
              <SearchIcon />
            </Button>
          </Box>
        </Box>
        <Divider sx={{ borderWidth: 1, borderColor: theme => theme.palette.primary.light }} />
        <Box marginTop={2} flex={1}>
          <DataTable
            data={drawingList}
            columns={columns}
            editMode='row'
            totalRows={totalRows}
            apiref={recordDataGridRef}
            paginationModel={paginationModel}
            onSelected={selectedRow => console.log(selectedRow)}
            onRowModesModelChange={handleRowModesModelChange}
            onPaginationModelChange={handlePaginationModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            rowModesModel={rowModesModel}
            paginationMode='server'
            sx={{ height: '100%' }}
          />
        </Box>
      </Box>
    </PageTransition>
  )
}
