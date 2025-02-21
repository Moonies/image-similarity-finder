import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EraseState {
  predictorId: string
}

const initialState: EraseState = {
  predictorId: '',
}

const eraseSlice = createSlice({
  name: 'erase',
  initialState,
  reducers: {
    setPredictorId: (state, action: PayloadAction<{ predictorId: string }>) => {
      state.predictorId = action.payload.predictorId
    },
    clearPredictorId: state => {
      state.predictorId = ''
    },
  },
})
export const { setPredictorId, clearPredictorId } = eraseSlice.actions
export default eraseSlice.reducer
