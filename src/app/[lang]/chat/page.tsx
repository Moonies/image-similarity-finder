'use client'

import { Avatar, Box, IconButton, Skeleton, TextField, Typography } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'

import React, { useEffect, useRef, useState } from 'react'
import useChat from './hooks/useChat'
import DataTable from '@/components/DataTable'
import { useGridApiRef } from '@mui/x-data-grid'
import PageTransition from '@/components/PageTransition'
import { useTranslation } from 'react-i18next'

export default function ChatPage() {
  const { t } = useTranslation('chat-page')

  const [input, setInput] = useState('')
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { handleSendMessage, loadingBot, messages } = useChat()
  const messageDataGridRef = useGridApiRef()

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Prevents the default behavior of form submission
      handleSendMessage(input)
      setInput('')
    }
  }

  useEffect(() => {
    scrollToBottom() // Scroll to the bottom whenever messages change
  }, [messages])

  return (
    <PageTransition>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        borderRadius={2}
        sx={{
          border: '1px solid',
        }}
      >
        {/* Chat Header */}
        <Box padding={2} textAlign={'center'}>
          <Typography variant='h6'>{t('title')}</Typography>
        </Box>
        {/* Chat Messages */}
        <Box
          ref={chatContainerRef}
          display={'flex'}
          flexDirection={'column'}
          flex={1}
          gap={2}
          padding={2}
          sx={{
            overflowY: 'auto',
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
                {message.data && (
                  <Box>
                    <DataTable
                      data={message.data.row}
                      columns={message.data.column}
                      apiref={messageDataGridRef}
                      onSelected={selectedRow => console.log(selectedRow)}
                      hideFooter={true}
                      sx={{ height: '300px', width: '500px' }}
                    />
                  </Box>
                )}
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
              <Skeleton
                variant='rectangular'
                width='40%'
                height={40}
                sx={{ borderRadius: '16px' }}
              />
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
            placeholder={t('inputPlaceholder')}
            value={input}
            minRows={1}
            maxRows={4}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loadingBot}
          />
          <IconButton color='primary' onClick={() => handleSendMessage(input)}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </PageTransition>
  )
}
