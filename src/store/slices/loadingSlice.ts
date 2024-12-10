// src/store/slices/loadingSlice.ts
import { createSlice } from '@reduxjs/toolkit'

interface LoadingState {
  isLoading: boolean
  count: number // For handling multiple loading calls
}

const initialState: LoadingState = {
  isLoading: false,
  count: 0,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: state => {
      state.count += 1
      state.isLoading = true
    },
    stopLoading: state => {
      state.count = Math.max(0, state.count - 1)
      state.isLoading = state.count > 0
    },
  },
})

export const { startLoading, stopLoading } = loadingSlice.actions
export default loadingSlice.reducer
