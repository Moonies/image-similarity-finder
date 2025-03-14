import { Box, Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'
import PromptSuggestionCard from '../PromptSuggestionCard'

interface PromptDisplay {
  isVisible: boolean
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
            sx={{ marginTop: 4, width: '100%' }}
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
