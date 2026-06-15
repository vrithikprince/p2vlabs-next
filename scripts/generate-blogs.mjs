/**
 * generate-blogs.mjs — one-shot blog generator + publisher.
 *
 * Reads:
 *   - d:/P2VLabs/google_key_for_blogs/.env  → Gemini API key (api_key)
 *   - ./.env.local                          → Supabase URL + anon key
 *
 * For each topic in TOPICS:
 *   1. Calls Gemini-3-flash-preview to generate Tiptap-compatible HTML body
 *      + excerpt + meta description (returned as JSON).
 *   2. Fetches a keyword-matched copyright-free photo from LoremFlickr
 *      (Creative Commons photos from Flickr).
 *   3. Uploads the photo to Supabase storage under bucket `blog`.
 *   4. Inserts a row into `blog_posts` with status='published' and
 *      backdated `published_at` to spread the run organically.
 *
 * Idempotent: if a slug already exists, the topic is skipped (so a partial
 * failure can be re-run safely).
 *
 * Usage:
 *   node scripts/generate-blogs.mjs              # generate all topics
 *   node scripts/generate-blogs.mjs --dry-run    # print plan, no API calls
 *   node scripts/generate-blogs.mjs --only=N     # only topic index N (1-10)
 */

import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

/* ─────────────────────────────────────────────
   ENV
───────────────────────────────────────────── */
const parseEnv = (p) =>
  Object.fromEntries(
    fs.readFileSync(p, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      })
  )

const SUPA = parseEnv(path.resolve(process.cwd(), '.env.local'))
const GEM  = parseEnv('d:/P2VLabs/google_key_for_blogs/.env')

const GEMINI_KEY = GEM.api_key
const SUPABASE_URL = SUPA.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = SUPA.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!GEMINI_KEY) throw new Error('Missing Gemini api_key')
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Missing Supabase env')

const sb = createClient(SUPABASE_URL, SUPABASE_KEY)

/* ─────────────────────────────────────────────
   TOPICS — locked plan
───────────────────────────────────────────── */
const TOPICS = [
  {
    n: 1,
    title: 'What "P2V" Actually Stands For (and Why It Matters)',
    slug: 'what-p2v-actually-stands-for',
    author: 'Vrithik Prince',
    publishAt: '2026-04-15T09:30:00+05:30',
    imageSearchTerms: ['photography studio interior', 'film camera lens', 'creative studio workspace'],
    primaryKeywords: ['P2V', 'P2V Labs', 'p2vlabs', 'Pixels to Visuals'],
    angle:
      'Brand etymology + philosophy post. Explains the name "P2V" = Pixels to Visuals — every project moves a brand from raw captured pixels to finished visuals that earn attention. Use the etymology to talk about the agency\'s philosophy: every frame has a purpose. Mention Ahmedabad once naturally. Founder voice (Vrithik).',
    voice: 'founder',
  },
  {
    n: 2,
    title: 'How to Pick a Social Media Agency in Ahmedabad (Without Regretting It in Three Months)',
    slug: 'how-to-pick-a-social-media-agency-in-ahmedabad',
    author: 'Vrithik Prince',
    publishAt: '2026-04-22T10:15:00+05:30',
    imageSearchTerms: ['Ahmedabad city skyline', 'modern office workspace', 'creative team meeting'],
    primaryKeywords: ['social media agency Ahmedabad', 'content agency Ahmedabad', 'Ahmedabad'],
    angle:
      'Practical buyer\'s guide. Five+ specific things to check before signing: portfolio depth, reporting cadence, in-house vs freelancer pool, whether they handle production OR just management, how they price (per-post vs retainer). Anchor to Ahmedabad market — name neighborhoods like SG Road, Bodakdev, CG Road if relevant. Mention common red flags (agency that posts your content but never measures, agencies that promise virality).',
    voice: 'founder',
  },
  {
    n: 3,
    title: 'How We Direct a Brand Film: From One-Line Brief to Final Cut',
    slug: 'how-we-direct-a-brand-film',
    author: 'Palash Karamchandani',
    publishAt: '2026-04-28T11:00:00+05:30',
    imageSearchTerms: ['film set production', 'cinema camera director', 'film slate clapperboard'],
    primaryKeywords: ['brand film', 'video production Ahmedabad', 'corporate film'],
    angle:
      'Process post from the director\'s chair. Walk through how a one-line brief from a client becomes a 90-second brand film — what we ask in the first call, how we build the treatment, how we scout location, how we cast (or don\'t), what changes between storyboard and shoot day, how grading shifts a film\'s feel. Technical but accessible. Director voice (Palash) — first-person craft, on-set specifics.',
    voice: 'director',
  },
  {
    n: 4,
    title: 'The Anatomy of a Brand Reel That Actually Converts',
    slug: 'the-anatomy-of-a-brand-reel-that-converts',
    author: 'Vrithik Prince',
    publishAt: '2026-05-04T08:45:00+05:30',
    imageSearchTerms: ['smartphone filming video', 'mobile phone recording', 'smartphone tripod video'],
    primaryKeywords: ['brand reel', 'Instagram reel', 'content that converts'],
    angle:
      'Structural breakdown of what makes a brand reel actually drive saves, shares, and DMs (not just views). Cover the first 0.5s "stop scroll" frame, the 3-second promise, the proof beat, the pattern break, the close (CTA or earned silence). Concrete: reference the kinds of reels that work for restaurants vs founder-led businesses vs product brands. Founder voice.',
    voice: 'founder',
  },
  {
    n: 5,
    title: 'The Quiet Math of Client Management in a Creative Agency',
    slug: 'the-quiet-math-of-client-management',
    author: 'Payal Chetwani',
    publishAt: '2026-05-11T12:30:00+05:30',
    imageSearchTerms: ['workspace desk laptop notebook', 'office desk planner', 'calm office workspace'],
    primaryKeywords: ['client management', 'creative agency', 'content agency'],
    angle:
      'Operations essay on what makes client relationships in a creative shop actually work — communication cadence, the difference between under-promising and over-explaining, why approvals get stuck, the value of a single source of truth (a portal, a Notion, a thread). Anonymise specific clients but include real moments. Operations voice (Payal) — process-thinking, calm.',
    voice: 'ops',
  },
  {
    n: 6,
    title: 'What 150+ Restaurant Shoots Taught Us About Food Photography in Ahmedabad',
    slug: 'lessons-from-150-restaurant-shoots-in-ahmedabad',
    author: 'Palash Karamchandani',
    publishAt: '2026-05-24T14:00:00+05:30',
    imageSearchTerms: ['Indian thali food photography', 'restaurant food plate', 'food styling photography'],
    primaryKeywords: ['food photography Ahmedabad', 'restaurant photography', 'Zomato photos'],
    angle:
      'Lessons learned from 150+ restaurant shoots — light, timing (golden hour vs noon), what plates work for camera vs eye, what condiments to keep out of frame, why styling matters more than camera, the wide vs tight ratio that wins on Zomato. Photographer/director voice (Palash). Mention specific dish types common in Gujarat (thali, dhokla, pizza, dosa) without listing client names.',
    voice: 'director',
  },
  {
    n: 7,
    title: 'How to Brief a Content Agency in 15 Minutes (and Get a Better Quote)',
    slug: 'how-to-brief-a-content-agency',
    author: 'Vrithik Prince',
    publishAt: '2026-05-30T16:45:00+05:30',
    imageSearchTerms: ['notebook pen desk', 'writing notebook coffee', 'creative brief paper'],
    primaryKeywords: ['content brief', 'video production brief', 'content agency'],
    angle:
      'A working template for a 15-minute brief that gets a content agency to quote accurately. Six specific fields to fill: business goal (not "more engagement"), one-line audience, primary asset needed, where it will live, success metric, deadline + budget range. Show why "we want a viral reel" is unbriefable, and what a usable version of that ask looks like. Founder voice.',
    voice: 'founder',
  },
  {
    n: 8,
    title: 'Why Your Instagram Feed Looks Generic — and the Visual System That Fixes It',
    slug: 'why-your-instagram-feed-looks-generic',
    author: 'Payal Chetwani',
    publishAt: '2026-06-04T09:00:00+05:30',
    imageSearchTerms: ['smartphone Instagram app', 'phone social media grid', 'social media smartphone'],
    primaryKeywords: ['Instagram aesthetic', 'brand identity', 'visual system'],
    angle:
      'Pattern essay on why most Indian brand Instagram feeds look interchangeable — same gradients, same stock-templated reels, same emoji-heavy captions. The fix is a visual system: a fixed palette, a typographic anchor, a recurring grid logic, recurring formats (founder POV reels, BTS, customer voice). Show how the system gives variety without breaking identity. Operations/systems voice (Payal).',
    voice: 'ops',
  },
  {
    n: 9,
    title: 'The Real Cost of Content Marketing in Ahmedabad (and Why Cheaper Isn\'t Cheaper)',
    slug: 'real-cost-of-content-marketing-in-ahmedabad',
    author: 'Vrithik Prince',
    publishAt: '2026-06-07T17:30:00+05:30',
    imageSearchTerms: ['Indian rupee banknotes', 'business calculator desk', 'office Ahmedabad'],
    primaryKeywords: ['content marketing Ahmedabad', 'video production cost', 'agency pricing'],
    angle:
      'Pricing transparency essay. The 8K reel vs 80K reel comparison — what changes in scope, light, time, post. Why a 8K reel for a restaurant is often the right call (and when it isn\'t). Anchor specific budget bands: starter (8K-25K/month), mid (25K-75K/month), brand-film (35K-2L per project). Mention that the *unseen* cost of cheap content is the months a brand wastes on assets that don\'t move. Founder voice.',
    voice: 'founder',
  },
  {
    n: 10,
    title: 'Why We Built P2V Labs in Ahmedabad and Not Mumbai',
    slug: 'why-p2v-labs-is-in-ahmedabad',
    author: 'Vrithik Prince',
    publishAt: '2026-06-08T11:30:00+05:30',
    imageSearchTerms: ['Ahmedabad architecture historic', 'Sabarmati riverfront Ahmedabad', 'Ahmedabad street'],
    primaryKeywords: ['P2V Labs Ahmedabad', 'content agency Ahmedabad', 'Ahmedabad'],
    angle:
      'Personal post about the choice of city. Why we picked Ahmedabad over Mumbai/Bangalore — proximity to underserved local brands, cost structure that lets us shoot more for less, and a creative scene that\'s finding its voice. Walk through what shooting in Ahmedabad gives clients (faster turnaround, on-site presence, cheaper logistics) vs Mumbai. Founder voice. Ends with a soft positioning note that we\'re building from here for the long term.',
    voice: 'founder',
  },
]

/* ─────────────────────────────────────────────
   GEMINI — generate body content as JSON
───────────────────────────────────────────── */
/* Using gemini-2.5-flash (production, fast) instead of gemini-3-flash-preview.
   The preview model was returning >2 min on the full blog prompt. */
const GEMINI_MODEL = 'gemini-2.5-flash'

const VOICE_GUIDES = {
  founder: 'Voice: Vrithik Prince, founder. Directional, opinionated, business-aware. Uses "we" when speaking for the agency. Comfortable taking positions. Writes for other founders/marketers.',
  director: 'Voice: Palash Karamchandani, director/cinematographer. Craft-focused, technical specifics from on-set, uses "I" when describing personal craft. Anchors abstract claims with concrete shoot-day moments.',
  ops: 'Voice: Payal Chetwani, operations + client lead. Process-thinking, calm, systems-oriented. References client situations anonymously. Avoids hype words; favours specifics and frameworks.',
}

function buildPrompt(t) {
  return `You are ghostwriting an editorial blog post for P2V Labs, a visual content agency in Ahmedabad, India.

TITLE: ${t.title}
AUTHOR: ${t.author}
${VOICE_GUIDES[t.voice]}

ANGLE / WHAT TO COVER:
${t.angle}

PRIMARY SEO KEYWORDS to weave in NATURALLY (not stuffed): ${t.primaryKeywords.join(', ')}
- Each primary keyword should appear 1-2 times in the body, in natural English. No stuffing.
- The title already covers the main keyword. Don't repeat it ten times.

P2V LABS CONTEXT (you must respect these facts):
- Visual content agency based in Ahmedabad, Gujarat, India.
- Founders: Vrithik Prince, Payal Chetwani, Palash Karamchandani.
- Services: brand films, social reels, food/product photography, monthly retainers, brand visual systems.
- 150+ restaurant shoots, 5M+ views across client reels, 90%+ retainer renewal rate.
- Studio aesthetic is editorial, restrained — think Loewe/A24, not Times Square neon.
- Pricing starts at ₹8,000 for reels/food shoots, ₹35,000 for brand films, ₹25,000/month for retainers.
- Client portal lives at clients.p2vlabs.in.

STRUCTURE the post:
- 1100-1500 words total.
- Open with a sharp, specific paragraph in <em> tags (editorial italic lede). 2-4 sentences.
- 4-7 H2 sections with <h2> tags. Each H2 is a real subhead, not a question.
- Within sections, mix paragraphs and one or two <ul><li> lists where useful.
- One short <blockquote> somewhere mid-article for emphasis.
- End with a 1-2 sentence close (no formal "Conclusion" header — let it land).
- No "Introduction" or "Conclusion" headings. Editorial prose, not blog-spam structure.

ALLOWED HTML (Tiptap subset): <p>, <h2>, <h3>, <strong>, <em>, <a href="">, <ul>, <ol>, <li>, <blockquote>. Nothing else. No <div>, <span>, <h1>, <img>, <script>.

OUTPUT FORMAT — DO NOT use JSON. Use these exact delimiter markers, with NO commentary, no markdown fences, nothing else:

===EXCERPT===
<60-100 word excerpt that sells the click. Distinct from the lede; can paraphrase.>
===META===
<140-160 char meta description for SERP snippet. Punchy.>
===BODY===
<the full HTML body, starting with the <em> lede. Raw HTML, no escaping needed.>
===END===`
}

async function generateContent(t) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(t) }] }],
        generationConfig: {
          temperature: 0.82,
          topP: 0.95,
          maxOutputTokens: 7500,
          /* No responseMimeType — we use delimiter-based output, so the
             model emits plain text with markers we extract by regex.
             JSON mode was failing because Gemini frequently mis-escapes
             nested double quotes inside HTML strings. */
        },
      }),
    }
  )
  const j = await r.json()
  if (j.error) throw new Error(`Gemini error: ${j.error.message}`)
  const text = j.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || ''
  if (!text) throw new Error('Gemini returned empty content')

  /* Extract sections by delimiter. */
  const grab = (start, end) => {
    const re = new RegExp(`===${start}===\\s*([\\s\\S]*?)\\s*===${end}===`)
    const m = text.match(re)
    return m ? m[1].trim() : null
  }
  const excerpt = grab('EXCERPT', 'META')
  const meta_description = grab('META', 'BODY')
  const content_html = grab('BODY', 'END')

  if (!excerpt || !meta_description || !content_html) {
    throw new Error(
      `Missing delimiter section — got excerpt:${!!excerpt} meta:${!!meta_description} body:${!!content_html}`
    )
  }
  return { excerpt, meta_description, content_html }
}

/* ─────────────────────────────────────────────
   COVER — typographic SVG cover, rendered to PNG via sharp.

   Cream background, large Playfair (fallback Georgia) title, charcoal
   text, single red hairline accent, "THE P2V JOURNAL" eyebrow, author
   byline + brand mark at the bottom. Editorial, brand-aligned, unique
   per post, no licensing risk.
───────────────────────────────────────────── */
const COVER_W = 1600
const COVER_H = 900

/* Estimate average glyph width relative to font size for serif display
   text. Playfair is roughly 0.52em average — varies by character but
   close enough for our wrapping pass. */
const GLYPH_RATIO = 0.52

function wrapTitle(title, fontSize, maxWidth) {
  const words = title.split(/\s+/)
  const avgGlyph = fontSize * GLYPH_RATIO
  const maxChars = Math.floor(maxWidth / avgGlyph)
  const lines = []
  let line = ''
  for (const w of words) {
    const next = line ? `${line} ${w}` : w
    if (next.length > maxChars && line) {
      lines.push(line)
      line = w
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildCoverSvg(t) {
  const PAD_X = 130
  const CONTENT_W = COVER_W - PAD_X * 2

  /* Title sizing — bump up for short titles, shrink for long ones. */
  const titleLen = t.title.length
  let fontSize = 96
  if (titleLen > 60) fontSize = 78
  if (titleLen > 80) fontSize = 68

  const lines = wrapTitle(t.title, fontSize, CONTENT_W)
  const lineHeight = fontSize * 1.05

  /* Vertical center the title block in the upper-middle of the canvas. */
  const titleBlockHeight = lines.length * lineHeight
  const titleY = (COVER_H - titleBlockHeight) / 2 + fontSize * 0.8

  const dateStr = new Date(t.publishAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${COVER_W}" height="${COVER_H}" viewBox="0 0 ${COVER_W} ${COVER_H}">
  <rect width="${COVER_W}" height="${COVER_H}" fill="#F5F0E8"/>

  <!-- Hairline accent -->
  <line x1="${PAD_X}" y1="160" x2="${PAD_X + 110}" y2="160" stroke="#c0392b" stroke-width="2"/>

  <!-- Eyebrow -->
  <text x="${PAD_X}" y="200" fill="#1a1a1a" fill-opacity="0.45"
        font-family="Inter, Helvetica, Arial, sans-serif" font-size="22"
        font-weight="500" letter-spacing="7">
    THE P2V JOURNAL
  </text>

  <!-- Title (manually wrapped) -->
  <g font-family="Playfair Display, Georgia, 'Times New Roman', serif"
     font-weight="700" fill="#1a1a1a" font-size="${fontSize}">
${lines
  .map(
    (line, i) =>
      `    <text x="${PAD_X}" y="${titleY + i * lineHeight}">${escapeXml(line)}</text>`
  )
  .join('\n')}
  </g>

  <!-- Author + date (bottom-left) -->
  <text x="${PAD_X}" y="${COVER_H - 100}" fill="#1a1a1a" fill-opacity="0.55"
        font-family="Inter, Helvetica, Arial, sans-serif" font-size="22" letter-spacing="4">
    ${escapeXml(t.author.toUpperCase())}  ·  ${escapeXml(dateStr.toUpperCase())}
  </text>

  <!-- P2V Labs mark (bottom-right) -->
  <text x="${COVER_W - PAD_X}" y="${COVER_H - 100}" text-anchor="end"
        fill="#c0392b" font-family="Playfair Display, Georgia, serif"
        font-style="italic" font-weight="700" font-size="28">
    P2V Labs
  </text>

  <!-- Bottom hairline -->
  <line x1="${PAD_X}" y1="${COVER_H - 70}" x2="${COVER_W - PAD_X}" y2="${COVER_H - 70}"
        stroke="#1a1a1a" stroke-opacity="0.12" stroke-width="1"/>
</svg>`
}

async function fetchAndUploadCover(t) {
  const svg = buildCoverSvg(t)
  const png = await sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 8 })
    .toBuffer()

  const filename = `${Date.now()}-${t.slug.slice(0, 40)}-cover.png`
  const { error } = await sb.storage.from('blog').upload(filename, png, {
    contentType: 'image/png',
    upsert: false,
  })
  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const url = `${SUPABASE_URL}/storage/v1/object/public/blog/${filename}`
  return {
    url,
    alt: `${t.title} — The P2V Journal`,
  }
}

/* ─────────────────────────────────────────────
   PUBLISH — insert blog_posts row
───────────────────────────────────────────── */
async function publish(t, dryRun) {
  /* Skip if slug already exists — keeps the script idempotent. */
  const { data: existing } = await sb
    .from('blog_posts')
    .select('id, slug')
    .eq('slug', t.slug)
    .maybeSingle()

  if (existing) {
    console.log(`  [${t.n}] SKIP — slug already exists: ${t.slug}`)
    return
  }

  console.log(`  [${t.n}] generating content…`)
  const gen = await generateContent(t)

  console.log(`  [${t.n}] fetching cover image…`)
  const cover = await fetchAndUploadCover(t)

  const row = {
    id: Date.now() + t.n, // millisecond-ish unique id (matches existing schema)
    slug: t.slug,
    title: t.title,
    excerpt: gen.excerpt,
    content_html: gen.content_html,
    cover_image_url: cover.url,
    cover_image_alt: cover.alt,
    meta_description: gen.meta_description,
    author: t.author,
    status: 'published',
    published_at: t.publishAt,
    created_at: t.publishAt,
    updated_at: t.publishAt,
    created_by: t.author,
    edited_by: t.author,
  }

  if (dryRun) {
    console.log(`  [${t.n}] DRY-RUN — would insert:`)
    console.log({
      ...row,
      content_html: row.content_html.slice(0, 200) + `…[${row.content_html.length} chars]`,
    })
    return
  }

  const { error } = await sb.from('blog_posts').insert(row)
  if (error) throw new Error(`Insert failed: ${error.message}`)
  console.log(`  [${t.n}] ✓ published: ${t.slug} (${t.author}, ${t.publishAt.slice(0, 10)})`)
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const onlyArg = args.find((a) => a.startsWith('--only='))
const onlyN = onlyArg ? parseInt(onlyArg.split('=')[1], 10) : null

const targets = onlyN ? TOPICS.filter((t) => t.n === onlyN) : TOPICS

console.log(`Generating ${targets.length} post(s)${dryRun ? ' (DRY RUN)' : ''}…\n`)

for (const t of targets) {
  try {
    await publish(t, dryRun)
  } catch (e) {
    console.error(`  [${t.n}] ✗ FAILED: ${e.message}`)
  }
}

console.log('\nDone.')
