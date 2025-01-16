'use client'

import { ZipContent } from '@/hooks/useZipExtractor'
import { createContext, useContext, useState, ReactNode } from 'react'

interface CacheStructure {
  searchCriteria: {
    keyword: string
    category: string
  }
  searchResults: {
    items: Array<any>
    metadata: { [key: string]: any }
  }
  filters: {
    [key: string]: any
  }
  rawData: { [key: string]: any }
  zipFile: ZipContent[]
}

interface CacheContextType {
  setPageData: <K extends keyof CacheStructure>(key: K, data: CacheStructure[K]) => void
  getPageData: <K extends keyof CacheStructure>(key: K) => CacheStructure[K] | null
  clearPageData: (key: keyof CacheStructure) => void
  clearAllCache: () => void
}

const CacheContext = createContext<CacheContextType>({
  // pageCache: {},
  setPageData: () => {},
  getPageData: () => null,
  clearPageData: () => {},
  clearAllCache: () => {},
})

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const [pageCache, setPageCache] = useState<Record<string, any>>({})

  const setPageData = <K extends keyof CacheStructure>(key: K, data: CacheStructure[K]) => {
    setPageCache(prev => ({
      ...prev,
      [key]: data,
    }))
  }

  const getPageData = <K extends keyof CacheStructure>(key: K): CacheStructure[K] | null => {
    return (pageCache[key] as CacheStructure[K]) || null
  }

  const clearPageData = (key: keyof CacheStructure) => {
    setPageCache(prev => {
      const newCache = { ...prev }
      delete newCache[key]
      return newCache
    })
  }

  const clearAllCache = () => {
    setPageCache({})
  }

  return (
    <CacheContext.Provider
      value={{
        // pageCache,
        setPageData,
        getPageData,
        clearPageData,
        clearAllCache,
      }}
    >
      {children}
    </CacheContext.Provider>
  )
}

export const useCache = () => useContext(CacheContext)
