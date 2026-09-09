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
  /* WGSL imports for the vgpu fluid simulation in the /services process band.
   *
   * Upstream's Next example wires @vgpu/wgsl/loader-webpack through the
   * top-level `turbopack` config key, which needs Next 15.5+. This project is
   * on 14.2, so the same loader goes through the webpack hook instead - it is
   * a webpack-compatible loader, and Turbopack only ever ran it through a
   * compatibility bridge anyway, so webpack is the more direct path.
   *
   * `type: 'javascript/auto'` because the loader emits an ES module, and
   * without it webpack would treat a .wgsl resource as an asset rather than
   * parsing the JS the loader returns. The loader resolves .wgsl-to-.wgsl
   * imports itself (fluid-common.wgsl is pulled in by seven of the others),
   * so only the entry files need to be reachable from JS. */
  webpack(config) {
    config.module.rules.push({
      test: /\.wgsl$/,
      type: 'javascript/auto',
      use: [{ loader: require.resolve('@vgpu/wgsl/loader-webpack') }],
    })
    return config
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
