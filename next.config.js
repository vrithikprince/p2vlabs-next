/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async redirects() {
    return [
      { source: '/portal',       destination: 'https://clients.p2vlabs.in',       permanent: true },
      { source: '/portal/:path*', destination: 'https://clients.p2vlabs.in/:path*', permanent: true },
      { source: '/login',         destination: 'https://clients.p2vlabs.in/login', permanent: true },
      { source: '/founders',       destination: 'https://founders.p2vlabs.in',       permanent: true },
      { source: '/founders/:path*', destination: 'https://founders.p2vlabs.in/:path*', permanent: true },
    ]
  },
}

module.exports = nextConfig
