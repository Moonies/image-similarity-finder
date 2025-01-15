import { useCallback, useMemo, useRef } from 'react'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { default as userApi } from '@/api/user'
import { default as drawingApi } from '@/api/drawing'

import { useAppSelector } from './useRedux'
export type HttpRequest = (
  fetchFunction: () => Promise<Response>,
  disableDisplayError?: boolean
) => Promise<Response>

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { user, token } = useAppSelector(state => state.auth)
  const apiRef = useRef<any>({})
  const { setLoading } = useLoading()

  const httpRequest: HttpRequest = useCallback(
    async (fetchFunction: () => Promise<Response>, disableDisplayError = false) => {
      try {
        const response = await fetchFunction()
        if (!response.ok) {
          throw await response.json()
        }
        return response
      } catch (error: any) {
        console.log(error)
        // const errorData = await error.json()

        // console.log(error)
        // console.log(errorData.response)

        if (disableDisplayError) return error

        setLoading(false)
        switch (error.status) {
          case 401:
            const confirmed = await openConfirmModal({
              title: 'Token Expired',
              message: 'Please reconnect to refresh your session.',
            })

            if (confirmed) {
              // const userData = getCurrentUser()
              // const token = getCurrentToken()

              // Create fetch instance for token refresh

              const result = await apiRef.current.user.checkAuth(user, token)

              if (result.code === 200 && result.data) {
                // refreshToken(result.data)
                notificationModal.info('Please try your action again.')
              } else {
                notificationSnackbar.error('Authentication failed: ' + error?.message)
              }
            }
            break
          case 413:
            notificationSnackbar.error('Error: ' + error?.title + `\n ${error?.detail}`)
            break
          default:
            notificationSnackbar.error(
              'Error: ' + error?.message + `\n status: ${error?.status}` + `\n ${error?.message}`
            )
            break
        }
        return error
      }
    },
    [setLoading, openConfirmModal, notificationSnackbar, user, token, notificationModal]
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
