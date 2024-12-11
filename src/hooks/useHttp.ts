import { useAuth } from './useAuth'
import { useConfirmModal } from './useConfirm'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'
import { default as userApi } from '@/api/user'
export type HttpRequest = (
  fetchFunction: () => Promise<Response>,
  disableDisplayError?: boolean
) => Promise<Response>

export default function useHttp() {
  const { notificationSnackbar, notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { getCurrentUser, getCurrentToken, refreshToken } = useAuth()
  const { setLoading } = useLoading()

  const httpRequest: HttpRequest = async (
    fetchFunction: () => Promise<Response>,
    disableDisplayError = false
  ) => {
    try {
      const response = await fetchFunction()
      console.log(response)
      if (!response.ok) {
        throw {
          response: response,
        }
      }
      return response
    } catch (error: any) {
      console.log(error)
      if (disableDisplayError) return error

      setLoading(false)
      switch (error.status) {
        case 401:
          const confirmed = await openConfirmModal({
            title: 'Token Expired',
            message: 'Please reconnect to refresh your session.',
          })

          if (confirmed) {
            const userData = getCurrentUser()
            const token = getCurrentToken()

            // Create fetch instance for token refresh
            const result = await fetch('/api/auth/refresh-token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: userData?.username ?? '',
                refreshToken: token?.refreshToken ?? '',
              }),
            }).then(res => res.json())

            if (result.code === 200 && result.data) {
              refreshToken(result.data)
              notificationModal.info('Please try your action again.')
            } else {
              notificationSnackbar.error('Authentication failed: ' + error.message)
            }
          }
          break

        default:
          notificationSnackbar.error('Error: ' + error.message + `\n ${error.response?.message}`)
          break
      }
      return error
    }
  }

  // API instance creation remains similar
  const api = {
    user: userApi(httpRequest),
    // component: componentApi(httpRequest),
    // customer: customerApi(httpRequest),
    // ... other APIs
  }

  return { api }
}
