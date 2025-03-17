import { Message } from '@app/chat/hooks/useChat'
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

export const getChatHistory = (): Message | null => {
  const storedChat = localStorage.getItem('chat')
  return storedChat ? (JSON.parse(storedChat) as Message) : null
}

export const { addMessage, clearMessage } = chatSlice.actions
export default chatSlice.reducer
