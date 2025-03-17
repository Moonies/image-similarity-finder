import { Message } from '@/app/[lang]/chat/hooks/useChat'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ChatState {
  chatHistory: Message[]
}

const chatHistory = localStorage.getItem('chat')

const initialState: ChatState = {
  chatHistory: chatHistory ? JSON.parse(chatHistory) : [],
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<{ message: Message }>) => {
      const messages = [...state.chatHistory, action.payload.message]

      if (typeof window !== 'undefined') {
        localStorage.setItem('chat', JSON.stringify(messages))
      }

      return {
        chatHistory: messages,
      }
    },
    clearMessage: state => {
      state.chatHistory = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('chat')
      }
    },
  },
})

export const { addMessage, clearMessage } = chatSlice.actions
export default chatSlice.reducer
