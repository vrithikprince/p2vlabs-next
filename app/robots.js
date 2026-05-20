export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/founders', '/portal', '/login'],
    },
    sitemap: 'https://p2vlabs.in/sitemap.xml',
  }
}
