export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/founders', '/portal', '/login'],
    },
    sitemap: 'https://www.p2vlabs.in/sitemap.xml',
  }
}
