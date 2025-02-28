'use client'

import DataTable from '@/components/DataTable'
import PageTransition from '@/components/PageTransition'
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import useUser from './hooks/useUser'
import CustomColumn from './components/CustomColumn'
import { useTranslation } from 'react-i18next'
import UserForm from './components/UserForm'
import { UserDetail } from '@/api/user/getUserList'

export default function UserPage() {
  const { t } = useTranslation('user-page')
  const [openUserForm, setOpenUserForm] = useState(false)
  const [userFormMode, setUserFormMode] = useState<'add' | 'edit'>()
  const [selectedUserDetail, setSelectedUserDetail] = useState<Partial<UserDetail>>({})

  const userDataGridRef = useGridApiRef()
  const {
    handleChange,
    handlePaginationModelChange,
    totalRows,
    userList,
    searchCriteria,
    paginationModel,
    handleSearch,
  } = useUser()

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      const selectedData = userList.find(user => user.id === id)
      if (selectedData) {
        setSelectedUserDetail(selectedData)
        setUserFormMode('edit')
        setOpenUserForm(true)
      }
    },
    [userList]
  )

  const handleDeleteClick = useCallback((id: GridRowId) => () => {}, [])

  const handleAddClick = useCallback(() => {
    setUserFormMode('add')
    setOpenUserForm(true)
  }, [])

  const handleSubmit = useCallback(() => () => {}, [])

  const columns = useMemo(
    () =>
      CustomColumn({
        edit: handleEditClick,
        remove: handleDeleteClick,
        t: t,
      }),
    [handleDeleteClick, handleEditClick, t]
  )

  useEffect(() => {}, [])
  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box display={'flex'} flexDirection={'row'}>
          <Box display={'flex'} width={'40%'}>
            <TextField
              fullWidth
              name='keyword'
              label={t('inputLabel')}
              value={searchCriteria.keyword}
              onChange={e => handleChange('keyword', e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='start'>
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'end'}>
            <Button variant='contained' startIcon={<PersonAddIcon />} onClick={handleAddClick}>
              {t('addButton')}
            </Button>
          </Box>
        </Box>
        <Box marginTop={2} flex={1}>
          <DataTable
            data={userList}
            columns={columns}
            totalRows={totalRows}
            apiref={userDataGridRef}
            paginationModel={paginationModel}
            onSelected={selectedRow => console.log(selectedRow)}
            // onRowModesModelChange={handleRowModesModelChange}
            onPaginationModelChange={handlePaginationModelChange}
            // rowModesModel={rowModesModel}
            paginationMode='server'
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
        <UserForm
          open={openUserForm}
          initialData={selectedUserDetail}
          onClose={() => setOpenUserForm(false)}
          onSubmit={handleSubmit}
          mode={userFormMode}
        />
      </Box>
    </PageTransition>
  )
}
