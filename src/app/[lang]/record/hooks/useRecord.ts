import { DrawingImageDetail } from '@/api/drawing'
import { useCache } from '@/context/CacheContext'
import { useConfirmModal } from '@/hooks/useConfirm'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import {
  GridColDef,
  GridEventListener,
  GridPaginationModel,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
} from '@mui/x-data-grid'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CategorySaleSearch {
  value: string
  label: string
}

export type SearchCriteria = {
  category: string
  keyword: string
}

interface CachedData {
  [key: string]: DrawingImageDetail[]
}

export default function useRecord() {
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({})
  const [drawingList, setDrawingList] = useState<GridRowsProp>([])
  const [categorySearch, setCategorySearch] = useState<CategorySaleSearch[]>([])
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
  })
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { setPageData, getPageData } = useCache()
  const { api } = useHttp()
  const { setLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { t } = useTranslation('record-page')

  const getDrawingList = useMemo(
    () => async () => {
      const { page, pageSize } = paginationModel
      const currentSearchCriteria = searchCriteria
      const searchCriteriaParams = {
        ...currentSearchCriteria,
        page,
        pageSize,
      }
      const result = await api.drawing.getDrawingList(searchCriteriaParams)
      if (result.code === 200 && result.data) {
        setDrawingList(result.data)
        setTotalRows(result.page?.totalElements ?? 0)
        setCachedData(prevCache => ({
          ...prevCache,
          [`${page}-${pageSize}`]: result.data ? result.data : [],
        }))
        setLoading(false)
      }
    },
    [paginationModel, searchCriteria, setLoading, api]
  )

  const removeDrawing = useMemo(
    () => async (drawingId: string) => {
      const result = await api.drawing.removeDrawing(drawingId)
      return result
    },
    [api.drawing]
  )

  const addNewDrawing = useMemo(
    () => async (newDrawingFile: File | FileList) => {
      const result = await api.drawing.addNewDrawingImage(newDrawingFile)
      if (result.code === 200) {
        return result
      }
    },
    [api.drawing]
  )

  const handleSearch = useCallback(async () => {
    getDrawingList()
  }, [getDrawingList])

  const prepareCategorySearch = useCallback((columns: GridColDef[]) => {
    const result: CategorySaleSearch[] = []
    columns.forEach(item => {
      result.push({
        value: item.field,
        label: item?.headerName?.toLocaleLowerCase() || '',
      })
    })
    setCategorySearch(result)
  }, [])

  const handleChange = useCallback((name: string, value: string | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      const selectedData = drawingList.find(item => item.id === id)
      setLoading(true)
      // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } }) // edit inline need to discuss
      //check cache -> check searchCriteria -> check current page if update is success get all new with same searchCriteria else get all cache
      setPageData('searchCriteria', { ...searchCriteria })
      setPageData('searchResults', { drawingList: cachedData })
      setPageData('lastedPagination', {
        page: paginationModel.page,
        pageSize: paginationModel.pageSize,
        totalRow: totalRows,
      })
      setPageData('rawData', { ...selectedData })
      // const endcodeId = encodeURIComponent(id)

      router.push(`/${lang}/record/${id}`)
    },
    [
      drawingList,
      setLoading,
      setPageData,
      searchCriteria,
      cachedData,
      paginationModel.page,
      paginationModel.pageSize,
      totalRows,
      router,
      lang,
    ]
  )

  const handleSaveClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    },
    [rowModesModel, setRowModesModel]
  )

  const handleDeleteClick = useCallback(
    (drawingId: GridRowId) => async () => {
      const selectedData = drawingList.find(item => item.id === drawingId)

      const confirmed = await openConfirmModal({
        title: t('notification.titleConfirmRemove'),
        message: `${t('notification.confirmRemoveMessage')} ${selectedData?.drawingNumber}`,
      })
      if (confirmed) {
        setLoading(true)
        try {
          const result = await removeDrawing(drawingId as string)
          if (result.code === 200) {
            notificationSnackbar.success(t('notification.success.remove'))
            await getDrawingList()
          }
        } catch (error) {
          notificationSnackbar.error(JSON.stringify(error))
        } finally {
          setLoading(false)
        }
      }
    },
    [
      drawingList,
      openConfirmModal,
      t,
      setLoading,
      removeDrawing,
      notificationSnackbar,
      getDrawingList,
    ]
  )

  const handleCancelClick = useCallback(
    (id: GridRowId) => () => {
      setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      })

      const editedRow = drawingList.find(row => row.id === id)
      if (editedRow!.isNew) {
        setDrawingList(drawingList.filter(row => row.id !== id))
      }
    },
    [drawingList, rowModesModel]
  )

  const handleCache = useCallback(() => {
    const cachedDrawingList = getPageData('searchResults')
    const cachedSearchCriteria = getPageData('searchCriteria')
    const cachedPagination = getPageData('lastedPagination')

    if (cachedSearchCriteria) setSearchCriteria(cachedSearchCriteria)
    if (cachedDrawingList?.drawingList)
      setDrawingList(
        cachedDrawingList?.drawingList[`${cachedPagination?.page}-${cachedPagination?.pageSize}`]
      )
    if (cachedPagination) {
      setPaginationModel({ page: cachedPagination.page, pageSize: cachedPagination.pageSize })
      setTotalRows(cachedPagination?.totalRow)
    }
  }, [getPageData])

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false }
    setDrawingList(drawingList.map(row => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handlePaginationModelChange = async (newModel: GridPaginationModel) => {
    if (newModel.pageSize !== paginationModel.pageSize) {
      // If page size has changed, reset to the first page
      setPaginationModel({ page: 0, pageSize: newModel.pageSize })
      // Clear the cache when page size changes
      setCachedData({})
    } else {
      setPaginationModel(newModel)
    }
    const cacheKey = `${newModel.page}-${newModel.pageSize}`
    if (cachedData[cacheKey]) {
      setDrawingList(cachedData[cacheKey])
      return
    } else if (drawingList.length !== 0) {
      getDrawingList()
    }
  }

  const handleAddNewDrawing = useCallback(
    async (filesSelect: File | FileList) => {
      const response = await addNewDrawing(filesSelect)
      if (response && response.code === 200) {
        return true
      }
    },
    [addNewDrawing]
  )

  return {
    drawingList,
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
    handleSearch,
    handlePaginationModelChange,
    totalRows,
    paginationModel,
    handleCache,
    handleAddNewDrawing,
  }
}
