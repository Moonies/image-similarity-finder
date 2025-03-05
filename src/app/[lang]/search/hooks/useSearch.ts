import useHttp from '@/hooks/useHttp'
import { useZipExtractor } from '@/hooks/useZipExtractor'

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useCache } from '@/context/CacheContext'
import { useLoading } from '@/hooks/useLoading'
import UTIF from 'utif'

export default function useSearch() {
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const { api } = useHttp()
  const { setPageData } = useCache()
  const { handleZipInput } = useZipExtractor()
  const { setLoading } = useLoading()

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
        const id = encodeURIComponent(JSON.stringify(rawDataImageList))

        if (fileSelected.type === 'image/tiff' || fileSelected.type === 'image/tif') {
          const buffer = await fileSelected.arrayBuffer()
          const ifds = UTIF.decode(buffer)
          UTIF.decodeImage(buffer, ifds[0])
          const rgba = UTIF.toRGBA8(ifds[0])

          const canvas = document.createElement('canvas')
          canvas.width = ifds[0].width
          canvas.height = ifds[0].height

          const ctx = canvas.getContext('2d')
          if (ctx) {
            const imgData = ctx.createImageData(canvas.width, canvas.height)
            imgData.data.set(rgba)
            ctx.putImageData(imgData, 0, 0)

            const pngBlob = await new Promise<Blob>(resolve => {
              canvas.toBlob(blob => {
                if (blob) resolve(blob)
              }, 'image/png')
            })

            const uploadedFile = URL.createObjectURL(pngBlob)
            setPageData('rawData', {
              uploadedImage: uploadedFile,
              uploadedFileName: fileSelected.name,
            })
          }
        } else {
          const uploadedFile = URL.createObjectURL(fileSelected)
          setPageData('rawData', {
            uploadedImage: uploadedFile,
            uploadedFileName: fileSelected.name,
          })
        }
        router.push(`/${lang}/search/${id}`)
      }
    },
    [handleZipInput, lang, router, searchDrawing, setLoading, setPageData]
  )

  return { handleUpload }
}
