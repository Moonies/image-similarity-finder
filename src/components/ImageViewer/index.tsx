'use client'

import { CSSProperties, useState } from 'react'
import Image from 'next/image'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import { Box } from '@mui/material'

interface ImageWithViewerProps {
  imageUrl: string
  width?: number
  height?: number
  editable?: boolean
  newImageUpdate?: (newImage: File) => void
  cardMedia?: boolean
  style?: CSSProperties
}

export default function ImageWithViewer({
  imageUrl,
  width,
  height,
  editable = false,
  newImageUpdate,
  cardMedia = false,
  style,
}: ImageWithViewerProps) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      {cardMedia ? (
        <Box display={'block'} position={'relative'} height={height}>
          <Image
            alt='Preview'
            src={imageUrl}
            style={{ objectFit: 'contain' }}
            fill
            onClick={() => setModalOpen(true)}
          />
        </Box>
      ) : (
        <Image
          loader={({ src }) => src}
          src={imageUrl}
          alt='Preview'
          width={width}
          height={height}
          style={style}
          unoptimized={true}
          onClick={() => setModalOpen(true)}
        />
      )}
      {modalOpen && (
        <ImageViewerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imagePreview={imageUrl}
          editable={editable}
          onUpdate={newImageUpdate}
        />
      )}
    </>
  )
}
