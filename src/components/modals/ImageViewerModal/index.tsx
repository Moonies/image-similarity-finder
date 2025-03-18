import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material'
import {
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Edit as EditIcon,
} from '@mui/icons-material'
import { useRef, useState } from 'react'
import ImageUploadModal from '@/components/modals/ImageUploadModal'

interface imageViewerProps {
  open: boolean
  imagePreview: string
  onClose: () => void
  editable?: boolean
  onUpdate?: (newImage: File) => void
}
const zoomLevels = [1, 1.5, 2, 2.5, 3]
export default function ImageViewerModal({
  imagePreview,
  onClose,
  open,
  editable = false,
  onUpdate,
}: imageViewerProps) {
  const [currentZoomIndex, setCurrentZoomIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  // Refs to store drag start positions
  const dragRef = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  })

  const preventImageDrag = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentZoomIndex === 0) return

    setIsDragging(true)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      lastX: position.x,
      lastY: position.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || currentZoomIndex === 0) return

    const deltaX = e.clientX - dragRef.current.startX
    const deltaY = e.clientY - dragRef.current.startY

    // Calculate boundaries based on zoom level and actual image dimensions
    const zoomLevel = zoomLevels[currentZoomIndex]
    const imageElement = imageRef.current

    if (!imageElement) return

    // Calculate boundaries based on zoomed dimensions
    const zoomedWidth = imageElement.offsetWidth * zoomLevel
    const zoomedHeight = imageElement.offsetHeight * zoomLevel

    // Calculate maximum drag distances
    const maxDragX = (zoomedWidth - imageElement.offsetWidth) / 2
    const maxDragY = (zoomedHeight - imageElement.offsetHeight) / 2

    // New position with constraints
    const newX = Math.max(-maxDragX, Math.min(maxDragX, dragRef.current.lastX + deltaX))
    const newY = Math.max(-maxDragY, Math.min(maxDragY, dragRef.current.lastY + deltaY))

    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    if (currentZoomIndex < zoomLevels.length - 1) {
      setCurrentZoomIndex(prev => prev + 1)
    }
  }

  const handleZoomOut = () => {
    if (currentZoomIndex > 0) {
      setCurrentZoomIndex(prev => prev - 1)
      if (currentZoomIndex === 1) {
        setPosition({ x: 0, y: 0 }) // Reset position when zooming back to normal
      }
    }
  }

  const handleEditClick = () => {
    setOpenUploadImageModal(true)
  }

  const handleUploadImage = (newImage?: File) => {
    setOpenUploadImageModal(false)
    if (newImage && onUpdate) {
      onUpdate(newImage)
      onClose()
    }
  }

  // const resetZoom = () => {
  //   setCurrentZoomIndex(0)
  //   setPosition({ x: 0, y: 0 })
  // }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth={'lg'}
      keepMounted
      scroll={'paper'}
      // TransitionComponent={slide}
    >
      <Box>
        <DialogTitle>
          <Box display='flex' alignItems='center' justifyContent='space-between'>
            <Typography variant='h6'></Typography>
            <Box display={'flex'} gap={2}>
              {editable && (
                <IconButton
                  edge='end'
                  color='inherit'
                  onClick={handleEditClick}
                  aria-label='upload'
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                edge='end'
                color='inherit'
                onClick={handleZoomIn}
                aria-label='zoomIn'
                disabled={currentZoomIndex === zoomLevels.length - 1}
              >
                <ZoomInIcon />
              </IconButton>
              <IconButton
                edge='end'
                color='inherit'
                onClick={handleZoomOut}
                aria-label='zoomOut'
                disabled={currentZoomIndex === 0}
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display={'flex'} justifyContent='center' sx={{ maxWidth: 'lg' }}>
            <Box
              sx={{
                width: 'lg',
                // height: containerHeight,
                overflow: 'hidden',
                position: 'relative',
                cursor: currentZoomIndex === 0 ? 'default' : isDragging ? 'grabbing' : 'grab',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Box
                ref={imageRef}
                component='img'
                src={imagePreview}
                onDragStart={preventImageDrag}
                alt='Zoomable and draggable image'
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: isDragging ? 'none' : 'transform 0.3s ease',
                  transform:
                    currentZoomIndex === 0
                      ? 'none'
                      : `scale(${zoomLevels[currentZoomIndex]}) translate(${
                          position.x / zoomLevels[currentZoomIndex]
                        }px, ${position.y / zoomLevels[currentZoomIndex]}px)`,
                  userSelect: 'none',
                }}
              />
            </Box>
          </Box>
          {openUploadImageModal && (
            <ImageUploadModal onClose={handleUploadImage} open={openUploadImageModal} />
          )}
        </DialogContent>
      </Box>
    </Dialog>
  )
}
