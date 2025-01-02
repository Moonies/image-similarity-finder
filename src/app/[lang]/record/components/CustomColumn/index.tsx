import React from 'react'
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid'
import { TFunction } from 'i18next'

interface CustomColumn {
  edit(id: GridRowId): () => void
  save(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  cancle(id: GridRowId): () => void
  rowModesModel: GridRowModesModel
  t: TFunction
}
export default function CustomColumn({
  cancle,
  edit,
  save,
  remove,
  rowModesModel,
  t,
}: CustomColumn): GridColDef[] {
  return [
    {
      field: 'col1',
      headerName: t('column.col1'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col2',
      headerName: t('column.col2'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col3',
      headerName: t('column.col3'),
      headerAlign: 'center',
      flex: 1,
      editable: true,
    },
    {
      field: 'col4',
      headerName: t('column.col4'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col5',
      headerName: t('column.col5'),
      type: 'number',
      headerAlign: 'center',
      flex: 1,
      // valueGetter: (value, row) => {
      //   return row.quantity * row.price
      // },
    },
    {
      field: 'col6',
      headerName: t('column.col6'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col7',
      headerName: t('column.col7'),
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'col8',
      headerName: t('column.col8'),
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'col9',
      headerName: t('column.col9'),
      headerAlign: 'center',
    },
    {
      field: 'col10',
      headerName: t('column.col10'),
      headerAlign: 'center',
    },
    {
      field: 'col11',
      headerName: t('column.col11'),
      headerAlign: 'center',
    },
    {
      field: 'col12',
      headerName: t('column.col12'),
      headerAlign: 'center',
    },
    {
      field: 'col13',
      headerName: t('column.col13'),
      headerAlign: 'center',
    },
    {
      field: 'col14',
      headerName: t('column.col14'),
      headerAlign: 'center',
    },
    {
      field: 'col15',
      headerName: t('column.col15'),
      headerAlign: 'center',
    },
    {
      field: 'col16',
      headerName: t('column.col16'),
      headerAlign: 'center',
    },
    {
      field: 'col17',
      headerName: t('column.col17'),
      headerAlign: 'center',
    },
    {
      field: 'col18',
      headerName: t('column.col18'),
      headerAlign: 'center',
    },
    {
      field: 'col19',
      headerName: t('column.col19'),
      headerAlign: 'center',
    },
    {
      field: 'col20',
      headerName: t('column.col20'),
      headerAlign: 'center',
    },
    {
      field: 'col21',
      headerName: t('column.col21'),
      headerAlign: 'center',
    },
    {
      field: 'col22',
      headerName: t('column.col22'),
      headerAlign: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('column.action'),
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: any) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={save(id)}
            />,
            <GridActionsCellItem
              icon={<CloseIcon />}
              label='Cancel'
              className='textPrimary'
              onClick={cancle(id)}
              color='inherit'
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label='Edit'
            className='textPrimary'
            onClick={edit(id)}
            sx={{ backgroundColor: theme => theme.palette.warning.light }}
          />,
          <GridActionsCellItem
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
