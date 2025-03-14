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
  env: {
    HOST_IP: process.env.HOST_IP,
  },
}

export default nextConfig
