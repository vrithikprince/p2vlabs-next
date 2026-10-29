import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { articles } from '../content/international-growth/articles.mjs'

const publish = process.argv.includes('--publish')
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split(/\r?\n/)
  .filter(line => line && !line.startsWith('#')).map(line => {
    const i = line.indexOf('=')
    return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]
  }))
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const base = 'https://p2vlabs.in/editorial/international-growth'
const sourceLinks = {
  ai: ['Google: AI features and your website', 'https://developers.google.com/search/docs/appearance/ai-features'],
  language: ['Google: managing multilingual and multiregional sites', 'https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites'],
  traffic: ['Google: diagnosing search traffic drops', 'https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops'],
}

function html(article, index) {
  const inline = article.key === 'brief' ? 'measurement' : 'brief'
  const sections = article.sections.map(([heading, body], i) => {
    const paragraphs = body.startsWith('<') ? body : `<p>${escape(body)}</p>`
    const figure = i === 2 ? `<figure><img src="${base}/${inline}.webp" alt="${inline === 'brief' ? 'Conceptual editorial scene of a remote project planning desk' : 'Conceptual editorial scene of a marketing measurement workspace'}" width="1200" height="800" loading="lazy" decoding="async"><figcaption>AI-generated editorial illustration; not a client project or performance report.</figcaption></figure>` : ''
    return `<h2>${escape(heading)}</h2>${paragraphs}${figure}`
  }).join('\n')
  const sources = [sourceLinks.ai]
  if (article.key === 'saudi') sources.push(sourceLinks.language)
  if (article.key === 'measurement') sources.push(sourceLinks.traffic)
  const related = articles.filter((_, i) => i !== index).filter(a =>
    ['us', 'saudi', 'india'].includes(article.key) ? ['measurement', 'brief'].includes(a.key) : ['india', 'measurement'].includes(a.key))
  return `${sections}<h2>Discuss your next step with P2V Labs</h2><p>Explore our <a href="/services/${article.service}">relevant service and scope</a>, review <a href="/packages">current packages</a> or <a href="/contact?source=${article.slug}">send your website and project brief</a>. We are based in Ahmedabad; remote work, travel and specialist review are agreed per engagement.</p><h2>Related guides</h2><ul>${related.map(a => `<li><a href="/blog/${a.slug}">${escape(a.title)}</a></li>`).join('')}</ul><h2>Sources and editorial note</h2><p>These are practical planning recommendations, not promises of rankings or enquiries. Scenarios labelled hypothetical are examples, not customer results. Cover and supporting imagery are AI-generated editorial illustrations.</p><ul>${sources.map(([title, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${escape(title)}</a></li>`).join('')}</ul>`
}

// Validate the complete batch before any upload or database write.
const seen = new Set()
for (const article of articles) {
  if (seen.has(article.slug)) throw Error(`Duplicate slug: ${article.slug}`)
  seen.add(article.slug)
  const body = html(article, articles.indexOf(article))
  const words = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  if (words < 420 || !fs.existsSync(`content/international-growth/images/${article.key}.webp`)) throw Error(`Incomplete article: ${article.slug} (${words} words)`)
  console.log(`${publish ? 'READY' : 'DRY RUN'} ${article.slug}: ${words} words`)
}
if (!publish) process.exit(0)

const now = new Date().toISOString()
const existing = await sb.from('blog_posts').select('slug').in('slug', articles.map(a => a.slug))
if (existing.error) throw Error(existing.error.message)
const existingSlugs = new Set(existing.data.map(row => row.slug))
const rows = articles.filter(a => !existingSlugs.has(a.slug)).map((article, index) => ({
  id: Date.now() + index,
  slug: article.slug, title: article.title, excerpt: article.excerpt,
  content_html: html(article, articles.indexOf(article)),
  cover_image_url: `${base}/${article.key}.webp`,
  cover_image_alt: `AI-generated editorial illustration for: ${article.title}`,
  meta_description: article.excerpt,
  author: null, // Organization attribution; do not invent a founder byline.
  status: 'published', published_at: now, created_at: now, updated_at: now,
}))
if (rows.length) {
  const { error } = await sb.from('blog_posts').insert(rows)
  if (error) throw Error(`Publish failed: ${error.message}`)
}
fs.writeFileSync('content/international-growth/publication.json', JSON.stringify({ publishedAt: now, inserted: rows.map(row => row.slug), skippedExisting: [...existingSlugs], urls: articles.map(a => `https://p2vlabs.in/blog/${a.slug}`) }, null, 2))
console.log(`Published ${rows.length}; skipped ${existingSlugs.size} existing articles.`)
