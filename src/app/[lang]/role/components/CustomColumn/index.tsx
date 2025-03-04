import React from 'react'
import { Delete as DeleteIcon } from '@mui/icons-material'
import { GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid'
import { TFunction } from 'i18next'
import { Checkbox } from '@mui/material'

interface CustomColumn {
  remove(id: GridRowId): () => void
  permissionList: string[]
  t: TFunction
  convertHeaderName: (permissionKey: string) => string
  handlePermissionChange: (rowId: string, permission: string) => void
}
export default function CustomColumn({
  remove,
  t,
  permissionList,
  convertHeaderName,
  handlePermissionChange,
}: CustomColumn): GridColDef[] {
  return [
    {
      field: 'name',
      headerName: t('column.col1'),
      headerAlign: 'center',
    },
    ...permissionList.map(permission => ({
      field: permission,
      headerName: convertHeaderName(permission),
      flex: 1,
      renderCell: (params: any) => (
        <Checkbox
          checked={params.row.permissions.includes(permission)}
          onChange={() => handlePermissionChange(params.row.id, permission)}
        />
      ),
    })),
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: any) => [
        <GridActionsCellItem
          key={id}
          icon={<DeleteIcon />}
          label='Delete'
          onClick={remove(id)}
          sx={{ backgroundColor: theme => theme.palette.error.light, color: 'white' }}
        />,
      ],
    },
  ]
}
