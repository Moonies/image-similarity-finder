import type { NextConfig } from 'next'
import packageJson from './package.json'
import fs from 'fs'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true, //defatul true for debug
  devIndicators: {
    appIsrStatus: false,
  },
  // interpolation: {
  //   escapeValue: false,
  // },
  // react: {
  //   useSuspense: false,
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    APP_VERSION: packageJson.version,
  },
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf', // Alias to the legacy build
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // Ignore fs for client-side builds
    }
    if (process.env.NEXT_PUBLIC_ENV === 'production') {
      // Remove specific static files in production
      const mockDataPath = path.join(__dirname, 'public/static')
      if (fs.existsSync(mockDataPath)) {
        fs.rmSync(mockDataPath, { recursive: true, force: true })
      }
    }

    return config
  },
}

export default nextConfig
