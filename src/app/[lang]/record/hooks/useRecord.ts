import {
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import React, { useCallback, useMemo, useState } from 'react'

interface CategorySaleSearch {
  value: string
  label: string
}

const mock: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
  {
    id: 4,
    col1: 'MUI4',
    col2: 'is Amazing',
    col3: 'MUI4',
    col4: 'is Amazing',
    col5: 'MUI4',
    col6: 'is Amazing',
  },
]
export default function useRecord() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [mockData, setMockData] = useState(mock)
  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>([])
  const [searchCriteria, setSearchCriteria] = useState({ category: '', keyword: '' })

  const prepareCategorySearch = useCallback((columns: GridColDef[]) => {
    let result: CategorySaleSearch[] = []
    columns.forEach(item => {
      result.push({
        value: item.field,
        label: item?.headerName || '',
      })
    })
    setCategorySearch(result)
  }, [])

  const handleChange = (name: string, value: string | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    console.log('edit')
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    console.log('save')
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setMockData(mockData.filter(row => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = mockData.find(row => row.id === id)
    if (editedRow!.isNew) {
      setMockData(mockData.filter(row => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setMockData(mockData.map(row => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }
  return {
    mockData,
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
    searchCriteria,
    handleChange,
  }
}
