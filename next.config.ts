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
}

export default nextConfig
