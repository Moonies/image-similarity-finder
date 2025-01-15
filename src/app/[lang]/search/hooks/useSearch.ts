import useHttp from '@/hooks/useHttp'
import { useZipExtractor } from '@/hooks/useZipExtractor'

import { useParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useCache } from '@/context/CacheContext'

export default function useSearch() {
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { api } = useHttp()
  const { setPageData } = useCache()

  const { handleZipInput } = useZipExtractor()

  const handleUpload = useCallback(
    async (fileSelected: File) => {
      //API success
      const response = await searchDrawing(fileSelected)
      if (response) {
        const uploadedFile = URL.createObjectURL(fileSelected)
        const rawDataImageList = await handleZipInput(response)
        console.log(rawDataImageList)
        setPageData('rawData', { uploadedImage: uploadedFile })
        setPageData('zipFile', rawDataImageList)
        const id = encodeURIComponent(JSON.stringify(rawDataImageList))
        router.push(`/${lang}/search/${id}`)
      }
    },
    [handleZipInput, lang, router, setPageData]
  )

  const searchDrawing = async (fileSelected: File) => {
    const result = await api.drawing.searchDrawing(fileSelected)
    if (result.code === 200 && result.data) {
      return result.data
    } else {
    }
  }
  return { handleUpload }
}
