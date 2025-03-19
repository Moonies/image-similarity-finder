import NextImage, { ImageProps as NextImageProps } from 'next/image'
import React from 'react'
import logoMini from '@/assets/images/logo-mini.png'
import logoFull from '@/assets/images/logo-new-size.png'

const imageAsset = {
  logoMini,
  logoFull,
}
type ImageAsset = keyof typeof imageAsset

interface ImageList {
  src: ImageAsset
}

type ImageProps = ImageList & Omit<NextImageProps, keyof ImageList>

const Image: React.FC<ImageProps> = ({ ...props }) => {
  return <NextImage {...props} src={imageAsset[props.src]} />
}

export default Image
