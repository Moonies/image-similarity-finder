import { useCallback, useMemo, useRef } from 'react'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { default as userApi } from '@/api/user'
import { default as drawingApi } from '@/api/drawing'
import { getCurrentToken, getCurrentUser, setCredentials } from '@/store/slices/authSlice'
import { useAppDispatch } from './useRedux'

export type HttpRequest = (
  fetchFunction: () => Promise<Response>,
  disableDisplayError?: boolean
) => Promise<Response>

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const apiRef = useRef<any>({})
  const { setLoading } = useLoading()
  const dispatch = useAppDispatch()
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
    async (fetchFunction: () => Promise<Response>, disableDisplayError = false) => {
      try {
        const response = await fetchFunction()
        if (!response.ok) {
          const errorMessage = await handleAPIError(response)

          throw errorMessage
        }
        return response
      } catch (error: any) {
        console.log(error)
        // const errorData = await error.json()

        // console.log(error)
        // console.log(errorData)

        if (disableDisplayError) return error

        setLoading(false)
        switch (error.status) {
          case 401:
            const confirmed = await openConfirmModal({
              title: 'Token Expired',
              message: 'Please reconnect to refresh your session.',
            })

            if (confirmed) {
              const user = getCurrentUser()
              const storedToken = getCurrentToken()

              const result = await apiRef.current.user.checkAuth(user, storedToken?.refreshToken)

              if (result.code === 200 && result.data) {
                // refreshToken(result.data)
                dispatch(
                  setCredentials({
                    user: user,
                    token: result.data,
                  })
                )
                notificationModal.info('Please try your action again.')
              } else {
                notificationSnackbar.error('Authentication failed: ' + error?.message)
              }
            }
            break
          case 413:
            notificationSnackbar.error('Error: ' + error?.description + `\n ${error?.message}`)
            break
          default:
            notificationSnackbar.error(
              'Error: ' +
                error?.description +
                `\n status: ${error?.status}` +
                `\n ${error?.message}`
            )
            break
        }
        return error
      }
    },
    [
      handleAPIError,
      setLoading,
      openConfirmModal,
      notificationSnackbar,
      dispatch,
      notificationModal,
    ]
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
