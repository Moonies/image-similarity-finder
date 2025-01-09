import { useParams, useRouter } from 'next/navigation'
import React from 'react'

export default function useSearch() {
  const params = useParams()
  const lang = params.lang as string
  const router = useRouter()
  const handleUpload = () => {
    let id = 1
    //API success
    router.push(`/${lang}/search/${id}`)
  }
  return { handleUpload }
}
