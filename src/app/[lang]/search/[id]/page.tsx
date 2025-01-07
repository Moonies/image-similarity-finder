'use client'

import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useState } from 'react'
import image from '../mock/hataraku-image.jpg'
import TestLargeImage from '../mock/HAYARAKU-Data-Journey - Order Journey.jpg'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
export default function SearchDetail() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')

  return (
    <Box display={'flex'} flexDirection={'column'} flex={1} padding={2}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Typography variant='h4' color='primary'>
          Query Image
        </Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{ backgroundColor: theme => theme.palette.primary.light }}
        >
          <Typography variant='h4'>Similar Image</Typography>
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={2} padding={2}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component='img'
              alt='green iguana'
              height='345'
              image={image.src}
              onClick={e => {
                setSelectedImage(image.src)
                setModalOpen(true)
              }}
            />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button size='small'>More Info</Button>
              {/* <Button size='small'>Learn More</Button> */}
              <Typography variant='h6'>Similarity: 000%</Typography>
            </CardActions>
          </Card>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia
              component='img'
              alt='green iguana'
              height='345'
              image={TestLargeImage.src}
              onClick={e => {
                setSelectedImage(TestLargeImage.src)
                setModalOpen(true)
              }}
            />
            <CardActions sx={{ justifyContent: 'space-between' }}>
              <Button size='small'>More Info</Button>
              {/* <Button size='small'>Learn More</Button> */}
              <Typography variant='h6'>Similarity: 000%</Typography>
            </CardActions>
          </Card>
        </Box>
      </Box>
      {modalOpen && (
        <ImageViewerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imagePreview={selectedImage}
        />
      )}
    </Box>
  )
}
