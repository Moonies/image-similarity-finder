import { UserDetail, UserListSearchCriteria } from '@/api/user/getUserList'
import useHttp from '@/hooks/useHttp'
import { GridPaginationModel } from '@mui/x-data-grid'
import { useCallback, useMemo, useState } from 'react'

export type SearchCriteria = {
  category: string
  keyword?: string
}
interface CachedData {
  [key: string]: UserDetail[]
}

const mock: UserDetail[] = [
  {
    id: '1',
    employeeNumber: '001',
    email: 'abc@gmail.com',
    lastname: '山本',
    name: '武',
    role: '',
    username: 'test01',
  },
  {
    id: '2',
    employeeNumber: '002',
    email: '',
    lastname: '高木',
    name: '美夜',
    role: '',
    username: 'it00',
  },
  {
    id: '3',
    employeeNumber: '003',
    email: '',
    lastname: 'abc',
    name: 'defg',
    role: '',
    username: 'test02',
  },
]

export default function useUser() {
  const { api } = useHttp()
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    category: '',
    keyword: '',
  })
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [userList, setUserList] = useState<UserDetail[]>([])
  const [cachedData, setCachedData] = useState<CachedData>({})
  const [totalRows, setTotalRows] = useState(0)

  const getUserList = useMemo(
    () => async () => {
      const { page, pageSize } = paginationModel
      const searchCriteriaParams: UserListSearchCriteria = {
        ...searchCriteria,
        page,
        pageSize,
      }
      const result = await api.user.getUserList(searchCriteriaParams)
      if (result.code === 200 && result.data) {
        setUserList(result.data)
        setTotalRows(result.page?.totalElements ?? 0)
        setCachedData(prevCache => ({
          ...prevCache,
          [`${page}-${pageSize}`]: result.data ? result.data : [],
        }))
      }
    },
    [api.user, paginationModel, searchCriteria]
  )

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
      setUserList(cachedData[cacheKey])
      return
    } else if (userList.length !== 0) {
      getUserList()
    }
  }

  const handleChange = useCallback((name: string, value: string | null) => {
    setSearchCriteria(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSearch = useCallback(() => {
    // getUserList()
    setUserList(mock)
  }, [getUserList])

  return {
    userList,
    totalRows,
    handlePaginationModelChange,
    handleChange,
    searchCriteria,
    paginationModel,
    handleSearch,
  }
}
