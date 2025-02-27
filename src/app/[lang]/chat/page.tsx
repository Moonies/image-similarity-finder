'use client'

import { Avatar, Box, IconButton, Skeleton, TextField, Typography } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

import React, { useEffect, useRef, useState } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loadingBot, setLoadingBot] = useState(false) // State to track loading
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleSendMessage = () => {
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
    handleReciveMessage()
    setInput('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Prevents the default behavior of form submission
      handleSendMessage()
    }
  }

  const handleReciveMessage = () => {
    setLoadingBot(true)
    console.log(messages)
    const newMessage: Message = {
      id: messages.length + 2,
      text: 'test recive Message',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h24',
      }),
    }
    setTimeout(() => {
      setMessages(prevMessage => [...prevMessage, newMessage])
      setLoadingBot(false)
    }, 2000)
  }

  useEffect(() => {
    scrollToBottom() // Scroll to the bottom whenever messages change
  }, [messages])

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      flex={1}
      borderRadius={2}
      sx={{
        border: '1px solid #ddd',
        // borderRadius: '8px',
        // overflow: 'hidden',
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          padding: '16px',
          // backgroundColor: '#1976d2',
          // color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant='h6'>Chat</Typography>
      </Box>

      {/* Chat Messages */}
      <Box
        ref={chatContainerRef}
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        gap={2}
        sx={{
          // flex: 1,
          padding: '16px',
          overflowY: 'auto',
          // display: 'flex',
          // flexDirection: 'column',
          backgroundColor: theme => theme.palette.background.paper,
        }}
      >
        {messages.map(message => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
              gap: '8px',
            }}
          >
            <Avatar
              sx={{
                bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
              }}
            >
              {message.sender === 'user' ? 'U' : 'B'}
            </Avatar>
            <Box
              sx={{
                maxWidth: '50%',
                padding: '8px 12px',
                borderRadius: '16px',
                backgroundColor: theme =>
                  message.sender === 'user'
                    ? theme.palette.primary.light
                    : theme.palette.secondary.light,
                color: theme =>
                  message.sender === 'user'
                    ? theme.palette.text.primary
                    : theme.palette.text.secondary,
              }}
            >
              <Typography variant='body1' sx={{ wordBreak: 'break-word' }}>
                {message.text.split('\n')}
              </Typography>
              <Typography variant='caption' sx={{ display: 'block', textAlign: 'right' }}>
                {message.timestamp}
              </Typography>
            </Box>
          </Box>
        ))}
        {/* Skeleton Loader for Bot */}
        {loadingBot && (
          <Box display={'flex'} flexDirection={'row'} gap={1}>
            <Skeleton variant='circular' width={40} height={40} />
            <Skeleton variant='rectangular' width='40%' height={40} sx={{ borderRadius: '16px' }} />
          </Box>
        )}
      </Box>

      {/* Input Box */}
      <Box
        display={'flex'}
        padding={1}
        sx={{
          borderTop: '1px solid #ddd',
        }}
      >
        <TextField
          fullWidth
          multiline
          size='small'
          placeholder='Type a message...'
          value={input}
          minRows={1}
          maxRows={4}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loadingBot}
        />
        <IconButton color='primary' onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
