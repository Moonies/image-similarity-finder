import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from './useRedux'
import { openLoginModal, closeLoginModal, selectIsLoginModalOpen } from '@/store/slices/loginSlice'

export const useLogin = () => {
  const dispatch = useAppDispatch()
  const isLoginOpen = useAppSelector(selectIsLoginModalOpen)

  const openLogin = useCallback(() => {
    dispatch(openLoginModal())
  }, [dispatch])

  const closeLogin = useCallback(() => {
    dispatch(closeLoginModal())
  }, [dispatch])

  return {
    isLoginOpen,
    openLogin,
    closeLogin,
  }
}
