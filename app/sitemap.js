export default async function sitemap() {
  const now = new Date()
  return [
    { url: 'https://www.p2vlabs.in',           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: 'https://www.p2vlabs.in/reel',      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://www.p2vlabs.in/packages',  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.p2vlabs.in/about',     lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.p2vlabs.in/contact',   lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
