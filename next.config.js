/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@imgly/background-removal-node', 'onnxruntime-node'],
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
}

module.exports = nextConfig
