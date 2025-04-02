'use client'

import React from 'react'
import Image from 'next/image'
import ImageViewerModal from '@/components/modals/ImageViewerModal'

interface ImageWithViewerProps {
  imageUrl: string
  width?: number
  height?: number
  style?: React.CSSProperties
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedImageUrl: string
  editable?: boolean
  newImageUpdate?: (newImage: File) => void
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void
}

export default function ImageWithViewer({
  imageUrl,
  width,
  height,
  style,
  isModalOpen,
  setIsModalOpen,
  selectedImageUrl,
  editable,
  newImageUpdate,
  onClick: handleClick,
}: ImageWithViewerProps) {
  return (
    <>
      <Image
        loader={({ src }) => src}
        src={imageUrl}
        alt='Preview'
        width={width}
        height={height}
        style={style}
        unoptimized={true}
        onClick={handleClick}
      />
      {isModalOpen && (
        <ImageViewerModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          imagePreview={selectedImageUrl}
          editable={editable}
          onUpdate={newImageUpdate}
        />
      )}
    </>
  )
}
