'use client'

import DataTable from '@/components/DataTable'
import PageTransition from '@/components/PageTransition'
import { Box, TextField } from '@mui/material'
import { GridColDef, useGridApiRef } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'

export default function UserPage() {
  const userDataGridRef = useGridApiRef()
  const [searchCriteria, setSearchCriteria] = useState({ keyword: '' })

  const columns: GridColDef[] = [
    {
      field: 'drawingNumber',
      headerName: 'user id',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'name',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'materialCost',
      headerName: 'email',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'materialSup',
      headerName: 'role',
      headerAlign: 'center',
      flex: 1,
    },
  ]

  const handleChange = useCallback((name: string, value: string | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }, [])

  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box>
          <TextField
            name='keyword'
            label={'keyword'}
            value={searchCriteria.keyword}
            onChange={e => handleChange('keyword', e.target.value)}
          />
        </Box>
        <Box marginTop={2} flex={1}>
          <DataTable
            data={[]}
            columns={columns}
            editMode='row'
            // totalRows={totalRows}
            apiref={userDataGridRef}
            // paginationModel={paginationModel}
            onSelected={selectedRow => console.log(selectedRow)}
            // onRowModesModelChange={handleRowModesModelChange}
            // onPaginationModelChange={handlePaginationModelChange}
            // onRowEditStop={handleRowEditStop}
            // processRowUpdate={processRowUpdate}
            // rowModesModel={rowModesModel}
            // paginationMode='server'
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
      </Box>
    </PageTransition>
  )
}
