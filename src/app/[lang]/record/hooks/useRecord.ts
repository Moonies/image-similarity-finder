import { useCache } from '@/context/CacheContext'
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
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

interface CategorySaleSearch {
  value: string
  label: string
}

export type SearchCriteria = {
  category: string
  keyword: string
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
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
  })
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { setPageData, getPageData } = useCache()

  const prepareCategorySearch = useCallback((columns: GridColDef[]) => {
    const result: CategorySaleSearch[] = []
    columns.forEach(item => {
      result.push({
        value: item.field,
        label: item?.headerName || '',
      })
    })
    setCategorySearch(result)
  }, [])

  const handleChange = useCallback((name: string, value: string | null) => {
    console.log('set')
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } }) // edit inline need to discuss
      setPageData('searchCriteria', { ...searchCriteria })
      router.push(`/${lang}/record/${id}`)
    },
    [setPageData, searchCriteria, router, lang]
  )

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    },
    [rowModesModel, setRowModesModel]
  )

  const handleDeleteClick = useCallback(
    (id: GridRowId) => () => {
      setMockData(mockData.filter(row => row.id !== id))
    },
    [mockData, setMockData]
  )

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      })

      const editedRow = mockData.find(row => row.id === id)
      if (editedRow!.isNew) {
        setMockData(mockData.filter(row => row.id !== id))
      }
    },
    [mockData, rowModesModel]
  )

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
    getPageData,
  }
}
