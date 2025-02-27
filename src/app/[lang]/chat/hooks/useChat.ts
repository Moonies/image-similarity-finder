import { useCallback, useMemo, useState } from 'react'
import useHttp from '@/hooks/useHttp'
import { DrawingMessage } from '@/api/chat/getMessage'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: string
}

export default function useChat() {
  const { api } = useHttp()
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

  const handleReciveMessage = useCallback((reciveMessage: DrawingMessage[]) => {
    // setLoadingBot(true)
    reciveMessage.forEach((detail, index) => {
      setTimeout(() => {
        setMessages(prevMessages => {
          const newMessage: Message = {
            id: prevMessages.length + 1,
            text: JSON.stringify(detail),
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h24',
            }),
          }

          return [...prevMessages, newMessage]
        })

        // If this is the last message, stop loading
        if (index === reciveMessage.length - 1) {
          setLoadingBot(false) // Set loading to false after all messages are processed
        }
      }, index * 1000)
    })
  }, [])

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
      setLoadingBot(true)

      const reciveMessage = await getMessage(input)
      if (!reciveMessage) return
      handleReciveMessage(reciveMessage)
    },
    [getMessage, handleReciveMessage, messages]
  )

  return { messages, handleReciveMessage, handleSendMessage, loadingBot }
}
