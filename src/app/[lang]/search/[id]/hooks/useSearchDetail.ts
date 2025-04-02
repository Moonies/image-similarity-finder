import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { useZipExtractor, ZipContent } from '@/hooks/useZipExtractor'
import { convertPdfToBlob, convertTifToBlob } from '@/utils/fileConvert'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type ImageUrl = {
  id: number
  url: string
  name: string
}
type MetaData = {
  [key: string]: number
} & {
  newDrawing?: boolean
}

export default function useSearchDetail() {
  const { api } = useHttp()
  const { withLoading, setLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const { handleZipInput } = useZipExtractor()
  const [imageUrls, setImageUrls] = useState<ImageUrl[]>([])
  const [metaData, setMetaData] = useState<MetaData>()
  const [isNewDrawing, setIsnewDrawing] = useState(false)

  const { t } = useTranslation('notification')

  const getDrawingDetail = useMemo(
    () => async (drawingNumber: string) => {
      const result = await api.drawing.getDrawingDetail(drawingNumber)
      if (result.code === 200 && result.data) {
        return result.data
      } else {
        // notificationSnackbar.error(result.message)
        // return result.data // if another data will be return in unsuccess
      }
    },
    [api.drawing]
  )

  const updateDrawingDetail = useMemo(
    () => async (formData: UpdateDrawingImageDetail) => {
      const result = await api.drawing.updateDrawingDetail(formData)
      if (result.code === 200) {
        notificationSnackbar.success(t('update.success'))
        return true
      } else {
        return false
      }
    },
    [api.drawing, notificationSnackbar, t]
  )

  const handleGetDetailImage = useCallback(
    async (selectedDrawing: string) => {
      // console.log(selectedDrawing) //H4440022xxxx.xxx example file name
      const drawingNumber = selectedDrawing.split('.')[0]
      const response = await withLoading(getDrawingDetail(drawingNumber))
      if (response) {
        return response
      }
    },
    [getDrawingDetail, withLoading]
  )

  const handleUpdateDrawingDetail = useCallback(
    async (formData: UpdateDrawingImageDetail) => {
      const response = await withLoading(updateDrawingDetail(formData))
      //if u have a condition or event must to put here
      return response
    },
    [updateDrawingDetail, withLoading]
  )

  const searchDrawing = useMemo(
    () => async (fileSelected: File, amount?: number) => {
      const result = await api.drawing.searchDrawing(fileSelected, amount)
      if (result.code === 200 && result.data) {
        return result.data
      }
      return null
    },
    [api.drawing]
  )

  const getContentUrl = useCallback(
    async (type: ZipContent['type'], content: string | Blob | ArrayBuffer) => {
      switch (type) {
        case 'image':
          return URL.createObjectURL(content as Blob)
        case 'tif':
          const pngBlob = await convertTifToBlob(content as Blob)
          if (!pngBlob) return ''
          return URL.createObjectURL(pngBlob)
        case 'pdf':
          const pngPdf = await convertPdfToBlob(content as Blob)
          if (!pngPdf) return ''
          return pngPdf

        //another case
        default:
          return ''
      }
    },
    []
  )

  const processImage = useCallback(
    async (zipData: ZipContent[]) => {
      setLoading(true)
      const newUrls = await Promise.all(
        zipData
          .filter((_, index) => index !== zipData.length - 1)
          .map(async (image, index, array) => {
            // if (index === array.length - 1) return
            const response: string = await getContentUrl(image.type, image.content)
            return {
              id: index,
              // url: image.type === 'image' ? URL.createObjectURL(image.content as Blob) : '',
              url: response,
              name: image.name.replace('files/', ''),
            }
          })
      )
      setImageUrls(newUrls)
      const metaData = zipData[zipData.length - 1].content as any
      const transformedContent: MetaData = Object.entries(metaData).reduce((acc, [key, value]) => {
        // Remove 'files/' from the key
        const newKey = key.replace('files/', '')
        return {
          ...acc,
          [newKey]: value,
        }
      }, {})

      setIsnewDrawing(metaData.newDrawing)
      setMetaData(transformedContent)
      setLoading(false)
    },
    [getContentUrl, setLoading]
  )

  const handleAmountSearch = useCallback(
    async (fileSelected: File, amount?: number) => {
      setLoading(true)
      const response = await searchDrawing(fileSelected, amount)
      if (response) {
        const rawDataImageList = await handleZipInput(response)
        console.log(rawDataImageList)
        processImage(rawDataImageList)
      }
    },
    [handleZipInput, processImage, searchDrawing, setLoading]
  )

  return {
    handleGetDetailImage,
    handleUpdateDrawingDetail,
    getContentUrl,
    imageUrls,
    metaData,
    isNewDrawing,
    setIsnewDrawing,
    processImage,
    handleAmountSearch,
  }
}
