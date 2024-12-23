'use client'

import { Box } from '@mui/material'

export default function ContentLayout({
  mainContent,
  submitArea,
}: {
  mainContent: React.ReactNode
  submitArea: React.ReactNode
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        p: 3,
      }}
    >
      <Box
        sx={{
          flex: 1,
          mr: 2,
          border: '1px solid #eee',
          borderRadius: 1,
          p: 2,
        }}
      >
        {mainContent}
      </Box>
      <Box
        sx={{
          width: 300,
          border: '1px solid #eee',
          borderRadius: 1,
          p: 2,
        }}
      >
        {submitArea}
      </Box>
    </Box>
  )
}
