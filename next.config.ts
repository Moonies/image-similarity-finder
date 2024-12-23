import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
  },
  // interpolation: {
  //   escapeValue: false,
  // },
  // react: {
  //   useSuspense: false,
  // },
}

export default nextConfig
