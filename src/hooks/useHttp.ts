import { useCallback, useMemo, useRef } from 'react'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { UserApi, default as userApi } from '@/api/user'
import { DrawingApi, default as drawingApi } from '@/api/drawing'
import { getCurrentToken, getCurrentUser, setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from './useRedux'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError, AxiosResponse } from 'axios'

export type HttpRequest = (
  fetchFunction: () => Promise<AxiosResponse>,
  disableDisplayError?: boolean
) => Promise<AxiosResponse | AxiosError | undefined>

type ApiType = {
  user: UserApi
  drawing: DrawingApi
}

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const apiRef = useRef<ApiType | null>(null)
  const { setLoading } = useLoading()
  const dispatch = useAppDispatch()
  const { t } = useTranslation('notification')

  const httpRequest: HttpRequest = useCallback(
    async (apiFunction: () => Promise<AxiosResponse>, disableDisplayError = false) => {
      try {
        const response: AxiosResponse = await apiFunction()
        return response
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          if (disableDisplayError) return error
          if (error.response) {
            setLoading(false)
            switch (error.response.status) {
              case 401:
                const confirmed = await openConfirmModal({
                  title: 'Token Expired',
                  message: 'Please reconnect to refresh your session.',
                })

                if (confirmed) {
                  const user = getCurrentUser()
                  const storedToken = getCurrentToken()

                  const result = await apiRef.current?.user.checkAuth(
                    user,
                    storedToken?.refreshToken ?? ''
                  )

                  if (result?.code === 200 && result.data) {
                    // refreshToken(result.data)
                    dispatch(
                      setCredentials({
                        user: user,
                        token: result.data,
                      })
                    )
                    notificationModal.info(t('token.reTask'))
                  } else {
                    notificationSnackbar.error('Authentication failed: ' + error?.message)
                    localStorage.removeItem('token')
                    window.location.reload()
                  }
                }
                break
              case 413:
                notificationSnackbar.error(`${t('error')}: ${error?.code}  \n ${error?.message}`)
                break
              default:
                notificationSnackbar.error(
                  `${t('error')}: ${error?.code}
                \n status: ${error?.status}
                \n ${error?.response.data.detail}`
                )
                break
            }
          }
          return error
        }
      }
    },
    [setLoading, openConfirmModal, notificationSnackbar, dispatch, notificationModal, t]
  )

  // Create api and store in ref
  const api = useMemo(() => {
    if (!apiRef.current) {
      // Only create the API instance if it doesn't already exist
      // when have a new group api must have to add in if statement
      apiRef.current = {
        user: userApi(httpRequest),
        drawing: drawingApi(httpRequest),
      }
    }
    return apiRef.current
  }, [httpRequest])

  return { api }
}
