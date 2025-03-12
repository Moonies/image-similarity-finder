import { Message } from '@/app/[lang]/chat/hooks/useChat'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatState {
  chatHistory: Array<Message>
}

const initialState: ChatState = {
  chatHistory: [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<any>) => {
      const previousChat = [...state.chatHistory]
      state.chatHistory = previousChat.concat(action.payload)
    },
  },
})

export const { addMessage } = chatSlice.actions
export default chatSlice.reducer
