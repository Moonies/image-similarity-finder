'use client'

import { Avatar, Box, Button, IconButton, Skeleton, TextField, Typography } from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import React, { useEffect, useRef, useState } from 'react'
import useChat, { Message } from './hooks/useChat'
import DataTable from '@/components/DataTable'
import { useGridApiRef } from '@mui/x-data-grid'
import PageTransition from '@/components/PageTransition'
import { useTranslation } from 'react-i18next'
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'
import PersonIcon from '@mui/icons-material/Person'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { useThemeContext } from '@/context/ThemeContext'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import { useAppSelector } from '@/hooks/useRedux'
import PromptSuggestionsCard from './components/PromptSuggestionsCard'
import { getChatHistory } from '@/store/slices/chatSlice'

export default function ChatPage() {
  const { t } = useTranslation('chat-page')
  const { mode } = useThemeContext()

  const [input, setInput] = useState('')
  const [isVisiblePromptCard, setIsVisiblePromptCard] = useState(true)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { handleSendMessage, loadingBot, messages } = useChat()
  const messageDataGridRef = useGridApiRef()

  const { chatHistory } = useAppSelector(state => state.chat)

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

  const handleChange = () => {
    setIsVisiblePromptCard(prev => !prev)
  }

  useEffect(() => {
    scrollToBottom() // Scroll to the bottom whenever messages change
  }, [messages])

  useEffect(() => {
    const chatHistory = getChatHistory()
    if (chatHistory) {
      setIsVisiblePromptCard(false)
    }
  }, [])

  return (
    <PageTransition>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        sx={{
          overflowY: 'auto',
        }}
      >
        {/* Chat Header */}
        <Box
          padding={2}
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <Button
            variant='text'
            sx={{
              color: theme =>
                mode === 'light' && !isVisiblePromptCard
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
            }}
            onClick={handleChange}
          >
            {isVisiblePromptCard ? <CloseOutlinedIcon /> : <HelpOutlineOutlinedIcon />}
          </Button>
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
            backgroundColor: theme => theme.palette.background.default,
          }}
        >
          {/* Prompt Suggestions */}
          <PromptSuggestionsCard isVisible={isVisiblePromptCard} />
          {chatHistory.map((message: Message, index: number) => (
            <Box
              key={index}
              display={'flex'}
              alignItems={'flex-end'}
              flexDirection={message.sender === 'user' ? 'row-reverse' : 'row'}
              gap={'8px'}
            >
              <Avatar
                sx={{
                  bgcolor:
                    mode === 'dark'
                      ? 'white'
                      : message.sender === 'user'
                      ? 'primary.main'
                      : 'black',
                }}
              >
                {message.sender === 'user' ? <PersonIcon /> : <SmartToyOutlinedIcon />}
              </Avatar>
              <Box
                padding={'8px 16px'}
                borderRadius={4}
                sx={{
                  maxWidth: '50%',
                  backgroundColor: theme =>
                    mode === 'light' && message.sender === 'user'
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                  color: theme =>
                    mode === 'light' && message.sender === 'user'
                      ? theme.palette.background.default
                      : theme.palette.text.primary,
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
                      initialState={{
                        columns: {
                          columnVisibilityModel: {
                            id: false,
                          },
                        },
                      }}
                      sx={{ height: '300px', width: '500px' }}
                    />
                  </Box>
                )}
                <Typography variant='caption' textAlign={'right'} display={'block'}>
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
                width='20%'
                height={40}
                sx={{ borderRadius: '16px', p: 2 }}
              />
            </Box>
          )}
        </Box>
        {/* Input Box */}
        <Box display={'flex'} padding={1} borderTop={'1px solid #ddd'}>
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
          <IconButton
            sx={{ color: mode === 'dark' ? 'white' : 'primary.main' }}
            onClick={() => handleSendMessage(input)}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </PageTransition>
  )
}
