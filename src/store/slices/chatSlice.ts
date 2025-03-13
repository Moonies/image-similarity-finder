import { Message } from '@/app/[lang]/chat/hooks/useChat'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface ChatState {
  chatHistory: Message[]
}

const initialState: ChatState = {
  chatHistory: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<any>) => {
      state.chatHistory = state.chatHistory.concat(action.payload)
    },
    clearMessage: state => {
      state.chatHistory = []
    },
  },
})

export const { addMessage, clearMessage } = chatSlice.actions
export default chatSlice.reducer
