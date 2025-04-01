import type { NextConfig } from 'next'
import packageJson from './package.json'

const nextConfig: NextConfig = {
  reactStrictMode: true, //defatul true for debug
  devIndicators: false,
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
      config.module.rules.push({
        test: /^mock.*\..*$/, // Matches files like mock.js, mock.json, mock.ts, etc.
        use: 'null-loader', // Ignore these files in production
      })
    }

    return config
  },
}

export default nextConfig
