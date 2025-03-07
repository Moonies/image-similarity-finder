import React from 'react'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material'
import { GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { UserDetail } from '@/api/user/getUserList'

interface CustomColumn {
  reset(id: GridRowId): () => void
  edit(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  t: TFunction
}
export default function CustomColumn({ reset, edit, remove, t }: CustomColumn): GridColDef[] {
  return [
    {
      field: 'number',
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
      valueGetter: (value, row: UserDetail) => `${row.lastName}　${row.firstName}`,
    },
    {
      field: 'mail',
      headerName: t('column.col4'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'role',
      headerName: t('column.col5'),
      headerAlign: 'center',
      flex: 1,
      valueGetter: (value, row: UserDetail) => `${row.role.name}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('column.action'),
      // width: 100,
      flex: 1,
      cellClassName: 'actions',
      getActions: ({ id }: any) => {
        return [
          <GridActionsCellItem
            key={id}
            icon={<LockResetIcon />}
            label='Reset Password'
            className='textPrimary'
            onClick={reset(id)}
            sx={{ backgroundColor: theme => theme.palette.info.light }}
          />,
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
