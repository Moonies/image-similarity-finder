import { useCallback, useMemo, useRef } from 'react'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { default as userApi } from '@/api/user'
import { default as drawingApi } from '@/api/drawing'
import { getCurrentToken, getCurrentUser, setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from './useRedux'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError, AxiosResponse } from 'axios'

export type HttpRequest = (
  fetchFunction: () => Promise<AxiosResponse>,
  disableDisplayError?: boolean
) => Promise<AxiosResponse | AxiosError | undefined>

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const apiRef = useRef<any>({})
  const { setLoading } = useLoading()
  const dispatch = useAppDispatch()
  const { t } = useTranslation('notification')

  const handleAPIError = useCallback(async (response: Response) => {
    console.log(response)
    try {
      // Try to parse as JSON first
      const data = await response.json()
      console.log(data)
      // return data.message || data.error || response.statusText;
      return {
        status: data.status,
        message: data.message || data.detail,
        description: data.description || data.title,
      }
    } catch {
      try {
        // If not JSON, try to get as text
        console.log(response)
        const text = await response.text()
        return text || response.statusText
      } catch {
        console.log(response)
        // If all fails, return status text
        // return response.statusText;
        return { status: response.status, message: response.statusText, description: null }
      }
    }
  }, [])

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

                  const result = await apiRef.current.user.checkAuth(
                    user,
                    storedToken?.refreshToken
                  )

                  if (result.code === 200 && result.data) {
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
                \n ${error?.message}`
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
    const apiInstance = {
      user: userApi(httpRequest),
      drawing: drawingApi(httpRequest),
    }
    apiRef.current = apiInstance // Store in ref
    return apiInstance
  }, [httpRequest])

  return { api }
}
