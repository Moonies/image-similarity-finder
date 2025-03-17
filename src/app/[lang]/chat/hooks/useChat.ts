import { useCallback, useMemo, useState } from 'react'
import useHttp from '@/hooks/useHttp'
import { DrawingMessage } from '@/api/chat/getMessage'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { useAppDispatch } from '@/hooks/useRedux'
import { addMessage } from '@/store/slices/chatSlice'

export interface Message {
  id: number
  text: string
  data?: { column: GridColDef[]; row: GridRowsProp }
  sender: 'user' | 'bot'
  timestamp: string
}

export default function useChat() {
  const { api } = useHttp()
  const dispatch = useAppDispatch()
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingBot, setLoadingBot] = useState(false)

  const getMessage = useMemo(
    () => async (senderMessage: string) => {
      const result = await api.chat.getMessage(senderMessage)
      if (result.code === 200 && result.data) {
        return result.data
      } else {
        setLoadingBot(false)
      }
    },
    [api.chat]
  )

  const handleReciveMessage = useCallback(
    (reciveMessage: DrawingMessage) => {
      if (reciveMessage.column[0] === 'error') {
        const newMessage: Message = {
          id: messages.length + 2, //to safe update id
          text: `${reciveMessage.row[0]['error']}`,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h24',
          }),
        }

        setMessages(prevMessage => [...prevMessage, newMessage])
        dispatch(addMessage({ message: newMessage }))
      } else {
        // Generate columns dynamically
        const columns = reciveMessage.column.map(col => {
          // Find the matching property name in the row object
          const field = Object.keys(reciveMessage.row[0]).find(
            key => key.toLowerCase() === col.toLowerCase().replace(/\s+/g, '_')
          )

          return {
            field: field || col, // Use the matching property or fallback to the column name
            headerName: col.charAt(0).toUpperCase() + col.slice(1), // Capitalize for header
            // width: 200,
          }
        })

        const newMessage: Message = {
          id: messages.length + 2, //to safe update id
          text: '',
          data: {
            column: columns,
            row: reciveMessage.row,
          },
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h24',
          }),
        }

        setMessages(prevMessage => [...prevMessage, newMessage])
        dispatch(addMessage({ message: newMessage }))
      }

      setLoadingBot(false)
    },
    [messages]
  )

  const handleSendMessage = useCallback(
    async (input: string) => {
      if (!input.trim()) return
      const newMessage: Message = {
        id: messages.length + 1,
        text: input,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h24',
        }),
      }
      setMessages([...messages, newMessage])
      dispatch(addMessage({ message: newMessage }))
      setLoadingBot(true)

      const reciveMessage = await getMessage(input)
      if (!reciveMessage) return

      handleReciveMessage(reciveMessage)
    },
    [getMessage, handleReciveMessage, messages]
  )

  return { messages, handleReciveMessage, handleSendMessage, loadingBot }
}
