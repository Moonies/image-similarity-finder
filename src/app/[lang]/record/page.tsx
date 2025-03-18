'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'
import { GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { Search as SearchIcon } from '@mui/icons-material'
import { Autocomplete, Box, Button, Divider, TextField } from '@mui/material'
import DataTable from '@/components/DataTable'
import useRecord from './hooks/useRecord'
import CustomColumn from './components/CustomColumn'
import { useTranslation } from 'react-i18next'
import PageTransition from '@/components/PageTransition'
import InputUploadFile from '@/components/InputUploadFile'
import { useNotification } from '@/hooks/useNotification'
import { useLoading } from '@/hooks/useLoading'
import usePrint from '@/hooks/usePrint'
import CustomToolbar from './components/CustomToolbar'
import { muiDataGridLocales } from '@/theme/theme'
import { useThemeContext } from '@/context/ThemeContext'

export default function RecordPage() {
  const { t } = useTranslation('record-page')
  const recordDataGridRef = useGridApiRef()
  const buttonUploadRef = useRef<HTMLInputElement>(null)
  const { notificationSnackbar } = useNotification()
  const { withLoading, setLoading } = useLoading()
  const { locale } = useThemeContext()

  const {
    drawingList,
    handleEditClick,
    handleDeleteClick,
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
    handleAddNewDrawing,
    handleDownloadClick,
    handlePrint,
    prepareColumVisibility,
    columnVisibilityModel,
    handleColumnVisibility,
  } = useRecord()

  const { printFile } = usePrint()

  const handlePrintClick = useCallback(
    (id: GridRowId) => async () => {
      setLoading(true)
      const response = await handlePrint(id as string)
      if (response) {
        setLoading(false)
        printFile(response)
      }
    },
    [handlePrint, printFile, setLoading]
  )

  const columns = useMemo(
    () =>
      CustomColumn({
        print: handlePrintClick,
        edit: handleEditClick,
        download: handleDownloadClick,
        remove: handleDeleteClick,
        rowModesModel,
        t: t,
      }),
    [handlePrintClick, handleEditClick, handleDownloadClick, handleDeleteClick, rowModesModel, t]
  )

  const handleChooseFile = useCallback(
    async (chooseFile: FileList | File | null) => {
      if (chooseFile) {
        const response = await withLoading(handleAddNewDrawing(chooseFile))
        if (response) {
          notificationSnackbar.success(t('notification.success.add'))
        }
        //for reset and upload same file
        if (buttonUploadRef.current) {
          buttonUploadRef.current.value = ''
        }
      }
    },
    [handleAddNewDrawing, notificationSnackbar, t, withLoading]
  )

  useEffect(() => {
    handleCache()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    prepareCategorySearch(columns)
    prepareColumVisibility(columns)
  }, [columns, prepareCategorySearch, prepareColumVisibility])

  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box flexDirection={'row'} display={'flex'} gap={2} padding={2}>
          <Autocomplete
            disablePortal
            options={categorySearch}
            getOptionLabel={option => option.label}
            onChange={(event, newValue) => handleChange('category', newValue?.value ?? '')}
            // onChange={(event, newValue) => console.log('category', event)}
            value={categorySearch.find(option => option.value === searchCriteria.category) || null}
            sx={{ width: 300 }}
            isOptionEqualToValue={(option, value) => option.value === value.value}
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
          <Box justifyContent={'center'} alignContent={'center'} marginLeft={'auto'}>
            <InputUploadFile
              onChoose={files => handleChooseFile(files)}
              ref={buttonUploadRef}
              multiple
              text={t('addDrawingButton')}
            />
          </Box>
        </Box>
        <Divider
          sx={{
            marginBottom: 2,
            borderWidth: 1,
            borderColor: theme => theme.palette.primary.light,
          }}
        />
        {/* <Box display={'flex'} marginTop={2} flex={1}> */}
        <DataTable
          data={drawingList}
          columns={columns}
          totalRows={totalRows}
          apiref={recordDataGridRef}
          paginationModel={paginationModel}
          onSelected={selectedRow => {}}
          onRowModesModelChange={handleRowModesModelChange}
          onPaginationModelChange={handlePaginationModelChange}
          rowModesModel={rowModesModel}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={handleColumnVisibility}
          paginationMode='server'
          localeText={muiDataGridLocales[locale].components.MuiDataGrid.defaultProps.localeText}
          slots={{
            toolbar: CustomToolbar,
          }}
          // sx={{ height: 600, width: '100%' }}
        />
        {/* </Box> */}
      </Box>
    </PageTransition>
  )
}
