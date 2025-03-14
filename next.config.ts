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
    HOST_URL: `http://${process.env.HOST_IP}:8081`,
  },
}

export default nextConfig
