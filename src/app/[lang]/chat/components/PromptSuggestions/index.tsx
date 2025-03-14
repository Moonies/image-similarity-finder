import { Box, Container, Grow, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'

interface PromptDisplay {
  isVisible: boolean
}

interface PromptMessage {
  isVisible: boolean
  timeout: number
  title: string
  message: string
}

const PromptSuggestionCard = ({ isVisible, timeout, title, message }: PromptMessage) => {
  return (
    <Grow
      in={isVisible}
      style={{ transformOrigin: '0 0 0' }}
      {...(isVisible ? { timeout: timeout } : {})}
    >
      <Box
        borderRadius={4}
        marginRight={2}
        marginY={1}
        paddingX={4}
        paddingY={2}
        sx={{
          backgroundColor: theme => theme.palette.background.paper,
          color: theme => theme.palette.text.primary,
        }}
      >
        <Stack spacing={1} direction={'row'} paddingBottom={1} alignItems={'center'}>
          <TipsAndUpdatesOutlinedIcon />
          <Typography variant='h6' fontWeight='bold'>
            {title}
          </Typography>
        </Stack>
        <Typography color='text.secondary'>{message}</Typography>
      </Box>
    </Grow>
  )
}

const PromptSuggestions = ({ isVisible }: PromptDisplay) => {
  const { t } = useTranslation('chat-page')

  return (
    <Box>
      <Container>
        <Box display={isVisible ? 'flex' : 'none'} flexWrap={'wrap'}>
          <Stack
            spacing={1}
            direction={'row'}
            alignItems={'center'}
            marginTop={4}
            sx={{ width: '100%' }}
          >
            <QuestionAnswerOutlinedIcon />
            <Typography variant='subtitle1'>{t('promptTitle')}</Typography>
          </Stack>
          <PromptSuggestionCard
            isVisible={isVisible}
            timeout={0}
            title={t('prompts.card1.title')}
            message={t('prompts.card1.message')}
          />
          <PromptSuggestionCard
            isVisible={isVisible}
            timeout={1000}
            title={t('prompts.card2.title')}
            message={t('prompts.card2.message')}
          />
          <PromptSuggestionCard
            isVisible={isVisible}
            timeout={1500}
            title={t('prompts.card3.title')}
            message={t('prompts.card3.message')}
          />
          <PromptSuggestionCard
            isVisible={isVisible}
            timeout={2000}
            title={t('prompts.card4.title')}
            message={t('prompts.card4.message')}
          />
          <PromptSuggestionCard
            isVisible={isVisible}
            timeout={2500}
            title={t('prompts.card5.title')}
            message={t('prompts.card5.message')}
          />
        </Box>
      </Container>
    </Box>
  )
}

export default PromptSuggestions
