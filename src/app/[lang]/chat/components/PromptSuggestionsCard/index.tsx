import { Box, Container, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PromptCard from './components/PromptCard'
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined'

interface PromptDisplay {
  isVisible: boolean
  onSelect: (sampleId: number) => void
}

const PromptSuggestionsCard = ({ isVisible, onSelect }: PromptDisplay) => {
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
          <PromptCard
            isVisible={isVisible}
            timeout={0}
            title={t('prompts.card1.title')}
            message={t('prompts.card1.message')}
            onClick={() => onSelect(1)}
            exampleMessage={t('prompts.card1.example')}
            //Retrieve the drawings with the drawing number equal "<YOUR DRAWING NUMBER>"
          />
          <PromptCard
            isVisible={isVisible}
            timeout={1000}
            title={t('prompts.card2.title')}
            message={t('prompts.card2.message')}
            onClick={() => onSelect(2)}
            exampleMessage={t('prompts.card2.example')}
            //Give me the sum of the general cost for all the drawings
          />
          <PromptCard
            isVisible={isVisible}
            timeout={1500}
            title={t('prompts.card3.title')}
            message={t('prompts.card3.message')}
            onClick={() => onSelect(3)}
            exampleMessage={t('prompts.card3.example')}
            //Retrieve all the drawings with a general cost inferior to 10 000 yen
          />
          <PromptCard
            isVisible={isVisible}
            timeout={2000}
            title={t('prompts.card4.title')}
            message={t('prompts.card4.message')}
            onClick={() => onSelect(4)}
            exampleMessage={t('prompts.card4.example')}
            //Retrieve all the drawings
          />
          <PromptCard
            isVisible={isVisible}
            timeout={2500}
            title={t('prompts.card5.title')}
            message={t('prompts.card5.message')}
            onClick={() => onSelect(5)}
            exampleMessage={t('prompts.card5.example')}
            //Give me the average general cost for all the drawings
          />
        </Box>
      </Container>
    </Box>
  )
}

export default PromptSuggestionsCard
