import { useState, useCallback } from 'react'
import { ZipReader, BlobReader, TextWriter, BlobWriter } from '@zip.js/zip.js'
import { configure } from '@zip.js/zip.js'

export interface ZipContent {
  name: string
  content: string | Blob | ArrayBuffer
  type: 'text' | 'image' | 'pdf' | 'json' | 'binary'
  size: number
  path: string[]
}

export interface ExtractOptions {
  onProgress?: (progress: number) => void
  onError?: (error: Error) => void
}
// Configure zip.js
configure({
  useWebWorkers: true,
  maxWorkers: 2,
})

export const useZipExtractor = () => {
  const [progress, setProgress] = useState(0)

  const getFileType = (filename: string): ZipContent['type'] => {
    const ext = filename.toLowerCase().split('.').pop()

    if (/^(jpg|jpeg|png|gif|webp|svg)$/.test(ext!)) return 'image'
    if (ext === 'pdf') return 'pdf'
    if (ext === 'json') return 'json'
    if (/^(txt|md|csv|html|xml|js|ts|css)$/.test(ext!)) return 'text'
    return 'binary'
  }

  const cleanDsStore = useCallback((obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj

    if (Array.isArray(obj)) {
      return obj.map(item => cleanDsStore(item))
    }

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key]) => !key.includes('.DS_Store'))
        .map(([key, value]) => [key, cleanDsStore(value)])
    )
  }, [])

  const processEntry = useCallback(
    async (entry: any): Promise<ZipContent> => {
      const type = getFileType(entry.filename)
      let content: string | Blob | ArrayBuffer

      // Skip .DS_Store files
      if (entry.filename.endsWith('.DS_Store')) {
        throw new Error('DS_Store file skipped')
      }
      switch (type) {
        case 'text':
        case 'json':
          const jsonText = await entry.getData(new TextWriter())
          try {
            const parsedContent = JSON.parse(jsonText)
            content = cleanDsStore(parsedContent)
          } catch {
            // If JSON parsing fails, treat it as text
            // content = jsonText
            content = await entry.getData(new TextWriter())
          }
          break

        case 'image':
        case 'pdf':
          content = await entry.getData(
            new BlobWriter(type === 'image' ? 'image/*' : 'application/pdf')
          )
          break

        default:
          content = await entry.getData(new BlobWriter())
      }

      const path = entry.filename.split('/')
      const name = path.pop()!

      return {
        name,
        content,
        type,
        size: entry.uncompressedSize,
        path,
      }
    },
    [cleanDsStore]
  )

  const handleZipInput = useCallback(
    async (input: File | Blob | ArrayBuffer | string): Promise<ZipContent[]> => {
      setProgress(0)

      try {
        let blob: Blob
        if (input instanceof File || input instanceof Blob) {
          blob = input
        } else if (input instanceof ArrayBuffer) {
          blob = new Blob([input], { type: 'application/zip' })
        } else if (typeof input === 'string') {
          const binaryString = atob(input)
          const bytes = new Uint8Array(binaryString.length)
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          blob = new Blob([bytes], { type: 'application/zip' })
        } else {
          return []
        }

        const reader = new ZipReader(new BlobReader(blob))
        const entries = await reader.getEntries()
        const results: ZipContent[] = []

        let processedSize = 0
        const totalSize = entries.reduce((sum, entry) => sum + entry.uncompressedSize, 0)

        for (const entry of entries) {
          if (entry.directory) continue

          try {
            const result = await processEntry(entry)
            results.push(result)

            processedSize += entry.uncompressedSize
            setProgress(Math.round((processedSize / totalSize) * 100))
          } catch {
            continue
          }
        }

        await reader.close()
        return results
      } catch {
        return []
      }
    },
    [processEntry]
  )

  return {
    progress,
    handleZipInput,
  }
}
