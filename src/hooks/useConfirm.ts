import { useContext } from 'react'
import { ConfirmModalContext } from '@/components/modals/ConfirmModal'

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext)
  if (context === undefined) {
    throw new Error('useConfirmModal must be used within a ConfirmModalProvider')
  }
  return context
}
