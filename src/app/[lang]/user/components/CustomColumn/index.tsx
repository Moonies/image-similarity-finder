import React from 'react'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { UserDetail } from '@/api/user/getUserList'

interface CustomColumn {
  edit(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  t: TFunction
}
export default function CustomColumn({ edit, remove, t }: CustomColumn): GridColDef[] {
  return [
    {
      field: 'employeeNumber',
      headerName: t('column.col1'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'username',
      headerName: t('column.col2'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: t('column.col3'),
      headerAlign: 'center',
      flex: 1,
      valueGetter: (value, row: UserDetail) => `${row.lastname}　${row.name}`,
    },
    {
      field: 'email',
      headerName: t('column.col4'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'role',
      headerName: t('column.col5'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('column.action'),
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: any) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={edit(id)}
            sx={{ backgroundColor: theme => theme.palette.warning.light }}
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label='Delete'
            onClick={remove(id)}
            sx={{ backgroundColor: theme => theme.palette.error.light, color: 'white' }}
          />,
        ]
      },
    },
  ]
}
