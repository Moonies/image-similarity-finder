import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface EraseState {
  predictorId: string
  fileName: string
}

const initialState: EraseState = {
  predictorId: '',
  fileName: '',
}

const eraseSlice = createSlice({
  name: 'erase',
  initialState,
  reducers: {
    setPredictorId: (state, action: PayloadAction<{ predictorId: string }>) => {
      state.predictorId = action.payload.predictorId
    },
    setFileName: (state, action: PayloadAction<{ fileName: string }>) => {
      state.fileName = action.payload.fileName
    },

    clearPredictorId: state => {
      state.predictorId = ''
    },
    clearFileDetail: state => {
      state.fileName = ''
    },
  },
})
export const { setPredictorId, clearPredictorId, setFileName, clearFileDetail } = eraseSlice.actions
export default eraseSlice.reducer
