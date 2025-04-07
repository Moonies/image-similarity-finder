import { useCallback, useMemo, useRef } from 'react'
import { useConfirmModal } from '@/hooks/useConfirm'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { default as userApi, UserApi } from '@/api/user'
import { default as drawingApi, DrawingApi } from '@/api/drawing'
import { default as eraserApi, EraserApi } from '@/api/eraser'
import { default as chatApi, ChatApi } from '@/api/chat'
import { default as roleApi, RoleApi } from '@/api/role'
import { default as permissionApi, PermissionApi } from '@/api/permission'
import {
  getCurrentToken,
  getCurrentUser,
  setCredentials,
  clearCredentials,
} from '@/store/slices/authSlice'
import { useAppDispatch } from './useRedux'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { usePathname, useRouter } from 'next/navigation'

export type HttpRequest = (
  fetchFunction: () => Promise<AxiosResponse>,
  disableDisplayError?: boolean
) => Promise<AxiosResponse | AxiosError | undefined>

type ApiType = {
  user: UserApi
  drawing: DrawingApi
  eraser: EraserApi
  chat: ChatApi
  role: RoleApi
  permission: PermissionApi
}

export default function useHttp() {
  const { notificationSnackbar } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const apiRef = useRef<ApiType | null>(null)
  const { setLoading, withLoading } = useLoading()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [lang, _currentPath] = pathname.replace(/^\//, '').split('/') // This will get 'en' and 'currentpaht' from '/en/viewer'

  const { t } = useTranslation('notification')

  const httpRequest: HttpRequest = useCallback(
    async (apiFunction: () => Promise<AxiosResponse>, disableDisplayError = false) => {
      try {
        const response: AxiosResponse = await apiFunction()
        if (
          !response.headers // No response body or headers
        ) {
          throw new Error('Invalid response: No data or headers returned.')
        }
        return response
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
          if (disableDisplayError) return error
          if (error.response) {
            setLoading(false)
            switch (error.response.status) {
              case 401:
                if (error.response.headers['www-authenticate'] === 'Token Expired') {
                  const confirmed = await openConfirmModal({
                    title: 'Token Expired',
                    message: 'Please reconnect to refresh your session.',
                  })

                  if (confirmed) {
                    const user = getCurrentUser()
                    const storedToken = getCurrentToken()

                    const result = await apiRef.current?.user.checkAuth(
                      user?.username ?? '',
                      storedToken?.refreshToken ?? ''
                    )

                    if (result?.code === 200 && result.data) {
                      dispatch(
                        setCredentials({
                          token: result.data,
                        })
                      )

                      return withLoading(httpRequest(apiFunction, disableDisplayError))
                    } else {
                      notificationSnackbar.error('Authentication failed: ' + error?.message)
                      await apiRef.current?.user.logout(true)
                      dispatch(clearCredentials())
                      router.replace(`/${lang}`)
                      window.location.reload()
                    }
                  } else {
                    // await apiRef.current?.user.logout(true)
                    dispatch(clearCredentials())
                    router.replace(`/${lang}`)
                  }
                } else {
                  notificationSnackbar.error(
                    `${t('error.code')}: ${error?.code}  \n ${error?.message}`
                  )
                  router.replace(`/${lang}`)
                }
                break
              case 413:
                notificationSnackbar.error(
                  `${t('error.code')}: ${error?.code}  \n ${error?.message}`
                )
                break
              default:
                notificationSnackbar.error(
                  `${t('error.code')}: ${error?.response.data.errorCode}
                  \n ${t('error.message')}: ${error?.response.data.errorMessage}
                \n ${t('error.devMessage')}: ${error?.response.data.message}`
                )
                break
            }
          }

          return error
        } else {
          notificationSnackbar.error(
            `${t('error.code')}: ${error?.code}
          \n ${error.message}`
          )
          return error
        }
      }
    },
    [setLoading, notificationSnackbar, t, openConfirmModal, dispatch, withLoading, router, lang]
  )

  // Create api and store in ref
  const api = useMemo(() => {
    if (!apiRef.current) {
      // Only create the API instance if it doesn't already exist
      // when have a new group api must have to add in if statement
      apiRef.current = {
        user: userApi(httpRequest),
        drawing: drawingApi(httpRequest),
        eraser: eraserApi(httpRequest),
        chat: chatApi(httpRequest),
        role: roleApi(httpRequest),
        permission: permissionApi(httpRequest),
      }
    }
    return apiRef.current
  }, [httpRequest])

  return { api }
}
