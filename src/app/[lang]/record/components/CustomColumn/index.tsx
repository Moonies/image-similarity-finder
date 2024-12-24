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
import { IconButton } from '@mui/material'

interface CustomColumn {
  edit(id: GridRowId): () => void
  save(id: GridRowId): () => void
  remove(id: GridRowId): () => void
  cancle(id: GridRowId): () => void
  rowModesModel: GridRowModesModel
}
export default function CustomColumn({
  cancle,
  edit,
  save,
  remove,
  rowModesModel,
}: CustomColumn): GridColDef[] {
  return [
    {
      field: 'col1',
      headerName: 'Drawing Number',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col2',
      headerName: 'Name',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col3',
      headerName: 'Selling Price',
      headerAlign: 'center',
      flex: 1,
      editable: true,
    },
    {
      field: 'col4',
      headerName: 'Material Cost',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col5',
      headerName: 'Material Supplier',
      type: 'number',
      headerAlign: 'center',
      flex: 1,
      // valueGetter: (value, row) => {
      //   return row.quantity * row.price
      // },
    },
    {
      field: 'col6',
      headerName: 'Lathe Cost',
      headerAlign: 'center',
      flex: 1,
    },
    {
      field: 'col7',
      headerName: 'Lathe Supplier',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'col8',
      headerName: 'Milling Cost',
      headerAlign: 'center',
      editable: true,
    },
    {
      field: 'col9',
      headerName: 'Milling Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col10',
      headerName: 'Heat Treatment Cost',
      headerAlign: 'center',
    },
    {
      field: 'col11',
      headerName: 'Heat Treatment Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col12',
      headerName: 'Grinding Cost',
      headerAlign: 'center',
    },
    {
      field: 'col13',
      headerName: 'Grinding Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col14',
      headerName: 'Transportation Cost',
      headerAlign: 'center',
    },
    {
      field: 'col15',
      headerName: 'Transportation Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col16',
      headerName: 'General Cost',
      headerAlign: 'center',
    },
    {
      field: 'col17',
      headerName: 'General Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col18',
      headerName: 'Welding Cost',
      headerAlign: 'center',
    },
    {
      field: 'col19',
      headerName: 'Welding Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col20',
      headerName: 'Other Cost',
      headerAlign: 'center',
    },
    {
      field: 'col21',
      headerName: 'Other Supplier',
      headerAlign: 'center',
    },
    {
      field: 'col22',
      headerName: 'Defect Details',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
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
