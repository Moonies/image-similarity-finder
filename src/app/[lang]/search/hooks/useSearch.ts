import useHttp from '@/hooks/useHttp'
import { useZipExtractor } from '@/hooks/useZipExtractor'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useCache } from '@/context/CacheContext'
import { useLoading } from '@/hooks/useLoading'
import { useAppDispatch } from '@/hooks/useRedux'
import { setAmountSearch } from '@/store/slices/userSettingSlice'
import { convertPdfToBlob, convertTifToBlob } from '@/utils/fileConvert'
import { useNotification } from '@/hooks/useNotification'
import { v4 as uuidv4 } from 'uuid'
export default function useSearch() {
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { api } = useHttp()
  const { setPageData } = useCache()
  const { handleZipInput } = useZipExtractor()
  const { setLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const dispatch = useAppDispatch()

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

  const handleUpload = useCallback(
    async (fileSelected: File, amount?: number) => {
      setLoading(true)
      const response = await searchDrawing(fileSelected, amount)
      if (response) {
        const rawDataImageList = await handleZipInput(response)
        setPageData('zipFile', rawDataImageList)
        console.log(rawDataImageList)
        const id = encodeURIComponent(uuidv4())

        if (fileSelected.type === 'image/tiff' || fileSelected.type === 'image/tif') {
          const tifBlob = await convertTifToBlob(fileSelected)
          if (!tifBlob) {
            setLoading(false)
            return notificationSnackbar.error('convert tif file failed')
          } else {
            setLoading(false)
            const uploadedFile = URL.createObjectURL(tifBlob)
            setPageData('rawData', {
              uploadedFile: fileSelected,
              uploadedImage: uploadedFile,
              uploadedFileName: fileSelected.name,
            })
          }
          setLoading(false)
        } else if (fileSelected.type === 'application/pdf') {
          const pdfBlob = await convertPdfToBlob(fileSelected)
          if (!pdfBlob) return notificationSnackbar.error('convert pdf file failed')
          const uploadedFile = pdfBlob
          setPageData('rawData', {
            uploadedFile: fileSelected,
            uploadedImage: uploadedFile,
            uploadedFileName: fileSelected.name,
          })
        } else {
          const uploadedFile = URL.createObjectURL(fileSelected)
          setPageData('rawData', {
            uploadedFile: fileSelected,
            uploadedImage: uploadedFile,
            uploadedFileName: fileSelected.name,
          })
        }
        router.push(`/${lang}/search/${id}`)
      }
    },
    [handleZipInput, lang, notificationSnackbar, router, searchDrawing, setLoading, setPageData]
  )

  const handleAmountSearch = useCallback(
    (newAmount: number) => {
      dispatch(setAmountSearch(newAmount))
    },
    [dispatch]
  )

  return { handleUpload, handleAmountSearch }
}
