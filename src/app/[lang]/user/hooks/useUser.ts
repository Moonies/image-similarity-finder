import { AddNewUser } from '@/api/user/addNewUser'
import { UserDetail, UserListSearchCriteria } from '@/api/user/getUserList'
import { UpdateUserDetail } from '@/api/user/updateUserDetail'
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

  const addNewUser = useMemo(
    () => async (data: AddNewUser) => {
      const result = await api.user.addNewUser(data)
      if (result.code === 200) {
        return true
      }
    },
    [api.user]
  )

  const updateUserDetail = useMemo(
    () => async (data: UpdateUserDetail) => {
      const result = await api.user.updateUserDetail(data)
      if (result.code === 200) {
        return true
      }
    },
    [api.user]
  )

  const removeUser = useMemo(
    () => async (userId: string) => {
      const result = await api.user.removeUser(userId)
      if (result.code === 200) {
        return true
      }
    },
    [api.user]
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
    getUserList()
  }, [getUserList])

  return {
    userList,
    totalRows,
    handlePaginationModelChange,
    handleChange,
    searchCriteria,
    paginationModel,
    handleSearch,
    addNewUser,
    updateUserDetail,
    removeUser,
  }
}
