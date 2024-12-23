import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '@/store'

interface ModalState {
  isLoginOpen: boolean
}

const initialState: ModalState = {
  isLoginOpen: true, // Set true by default for first visit
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openLoginModal: state => {
      state.isLoginOpen = true
    },
    closeLoginModal: state => {
      state.isLoginOpen = false
    },
  },
})

export const { openLoginModal, closeLoginModal } = modalSlice.actions
export const selectIsLoginModalOpen = (state: RootState) => state.login.isLoginOpen
export default modalSlice.reducer
