import type { NextConfig } from 'next'

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
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist': 'pdfjs-dist/legacy/build/pdf', // Alias to the legacy build
    }
    return config
  },
}

export default nextConfig
