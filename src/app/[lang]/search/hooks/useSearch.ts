import useHttp from '@/hooks/useHttp'
import { useZipExtractor } from '@/hooks/useZipExtractor'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useCache } from '@/context/CacheContext'
import { useLoading } from '@/hooks/useLoading'

export default function useSearch() {
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { api } = useHttp()
  const { setPageData } = useCache()
  const { handleZipInput } = useZipExtractor()
  const { setLoading } = useLoading()

  const searchDrawing = useMemo(
    () => async (fileSelected: File) => {
      const result = await api.drawing.searchDrawing(fileSelected)
      if (result.code === 200 && result.data) {
        return result.data
      }
      return null
    },
    [api.drawing]
  )

  const handleUpload = useCallback(
    async (fileSelected: File) => {
      setLoading(true)
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
    [handleZipInput, lang, router, searchDrawing, setLoading, setPageData]
  )

  return { handleUpload }
}
