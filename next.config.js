/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Explicit so future-me doesn't wonder: no trailing slash on URLs.
   * /foo/  → 308 → /foo. Keeps the canonical URL clean and matches the
   * `canonicalUrl()` helper in lib/seo.js. */
  trailingSlash: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.r2.dev' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.ytimg.com' },   // YouTube vlog thumbnails
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/portal',          destination: 'https://clients.p2vlabs.in/login',  permanent: true },
      { source: '/portal/:path*',   destination: 'https://clients.p2vlabs.in/:path*', permanent: true },
      { source: '/login',           destination: 'https://clients.p2vlabs.in/login',  permanent: true },
      { source: '/founders',        destination: 'https://founders.p2vlabs.in/founders', permanent: true },
      { source: '/founders/:path*', destination: 'https://founders.p2vlabs.in/:path*',   permanent: true },
    ]
  },
}

module.exports = nextConfig
