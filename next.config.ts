import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  // i18n: {
  //   defaultLocale: 'en',
  //   locales: ['en', 'ja'],
  // },
}

export default nextConfig
