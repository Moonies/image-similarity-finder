import type { NextConfig } from 'next'
import packageJson from './package.json'

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
    return config
  },
}

export default nextConfig
