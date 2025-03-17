import { Box, Grow, Stack, Typography } from '@mui/material'
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined'

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

export default PromptSuggestionCard
