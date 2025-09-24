/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/api/manifest',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig