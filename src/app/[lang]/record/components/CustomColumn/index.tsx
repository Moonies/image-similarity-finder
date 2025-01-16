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
      field: 'drawingNumber',
      headerName: t('column.col1'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'name',
      headerName: t('column.col2'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'materialCost',
      headerName: t('column.col3'),
      headerAlign: 'center',
      flex: 1,
      editable: true,
    },
    {
      field: 'materialSup',
      headerName: t('column.col4'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'latheCost',
      headerName: t('column.col5'),
      type: 'number',
      headerAlign: 'center',
      flex: 1,
      // valueGetter: (value, row) => {
      //   return row.quantity * row.price
      // },
    },
    {
      field: 'latheSup',
      headerName: t('column.col6'),
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'millingCost',
      headerName: t('column.col7'),
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'millingSup',
      headerName: t('column.col8'),
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'heartTreatmentCost',
      headerName: t('column.col9'),
      headerAlign: 'center',
    },
    {
      field: 'heartTreatmentSup',
      headerName: t('column.col10'),
      headerAlign: 'center',
    },
    {
      field: 'grindingCost',
      headerName: t('column.col11'),
      headerAlign: 'center',
    },
    {
      field: 'grindingSup',
      headerName: t('column.col12'),
      headerAlign: 'center',
    },
    {
      field: 'transportationCost',
      headerName: t('column.col13'),
      headerAlign: 'center',
    },
    {
      field: 'transportationSup',
      headerName: t('column.col14'),
      headerAlign: 'center',
    },
    {
      field: 'generalCost',
      headerName: t('column.col15'),
      headerAlign: 'center',
    },
    {
      field: 'generalSup',
      headerName: t('column.col16'),
      headerAlign: 'center',
    },
    {
      field: 'weldingCost',
      headerName: t('column.col17'),
      headerAlign: 'center',
    },
    {
      field: 'weldingSup',
      headerName: t('column.col18'),
      headerAlign: 'center',
    },
    {
      field: 'otherCost',
      headerName: t('column.col19'),
      headerAlign: 'center',
    },
    {
      field: 'otherSup',
      headerName: t('column.col20'),
      headerAlign: 'center',
    },
    {
      field: 'sellingPrice',
      headerName: t('column.col21'),
      headerAlign: 'center',
    },
    {
      field: 'defectDetails',
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
              key={id}
              icon={<SaveIcon />}
              label='Save'
              sx={{
                color: 'primary.main',
              }}
              onClick={save(id)}
            />,
            <GridActionsCellItem
              key={id}
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
