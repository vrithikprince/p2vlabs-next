/**
 * gen-pricing-pdf.mjs — generates a brand-aligned pricing PDF for P2V Labs.
 *
 * Mirrors the /packages page on www.p2vlabs.in and adds aggregator + online-
 * presence add-ons that aren't currently on the site. Run as:
 *
 *   node scripts/gen-pricing-pdf.mjs
 *
 * Output: d:/P2VLabs-Pricing.pdf (outside both repos so it doesn't get
 * committed accidentally; safe to share with prospects directly).
 *
 * Typography embeds Georgia + Arial from C:/Windows/Fonts so we get full
 * Unicode coverage (₹, →, ·, em-dashes). Georgia maps to the editorial
 * Playfair Display role (it's the brand's serif fallback on the site too);
 * Arial handles sans labels and body text.
 */

import PDFDocument from 'pdfkit'
import fs from 'node:fs'

const OUTPUT_PATH = 'D:/P2VLabs-Pricing.pdf'

/* Brand palette — same hex values as the site. */
const CREAM     = '#F5F0E8'
const CHARCOAL  = '#1a1a1a'
const RED       = '#c0392b'
const HAIRLINE  = '#1a1a1a'  // used with opacity

/* Fonts — pulled from Windows system fonts so we don't ship TTFs in the
   repo. Georgia covers the editorial serif role (Playfair Display fallback
   on the site is exactly Georgia) and has the rupee glyph in W10+ builds.
   Arial handles sans labels / body. PDFKit's built-in Times + Helvetica
   are WinAnsi-encoded and don't carry ₹ or → glyphs, which is why the
   first render showed "From ¹8,000" with a superscript-1 and arrows as
   "!'". */
const FONT_DIR = 'C:/Windows/Fonts'
const FONTS = {
  serif:           `${FONT_DIR}/georgia.ttf`,
  'serif-bold':    `${FONT_DIR}/georgiab.ttf`,
  'serif-italic':  `${FONT_DIR}/georgiai.ttf`,
  'serif-bi':      `${FONT_DIR}/georgiaz.ttf`,
  sans:            `${FONT_DIR}/arial.ttf`,
  'sans-bold':     `${FONT_DIR}/arialbd.ttf`,
}

const PAGE_W = 595.28  // A4 width in pts
const PAGE_H = 841.89  // A4 height in pts
const MARGIN = 50

/* ─────────────────────────────────────────────
   DATA — mirrors /packages page, plus add-ons.
───────────────────────────────────────────── */

const PROJECT_PACKAGES = [
  {
    category: 'Photography',
    title: 'Food Photography',
    priceLabel: '₹8,000',
    cadence: '/ shoot',
    blurb: 'Editorial-quality stills built for Zomato, Swiggy, and Instagram. The kind of photography that earns the order.',
    bullets: [
      'Up to 8 dishes / signature plates',
      'Half-day shoot at your venue',
      'Edit, colour, and delivery-ready files',
      'Optimised crops for Zomato / Swiggy / Instagram',
    ],
    bestFor: 'Restaurants · Cafés · Cloud kitchens',
  },
  {
    category: 'Social Video',
    title: 'Brand Reel',
    priceLabel: '₹8,000',
    cadence: '/ reel',
    blurb: 'A single 15–30 second reel — scripted, shot, and cut to convert scroll into engagement.',
    bullets: [
      'Concept, script, and storyboard',
      'Half-day shoot',
      'Edit with sound design and captions',
      'Instagram + YouTube Shorts ready',
    ],
    bestFor: 'New menu drops · Product launches · Campaigns',
  },
  {
    category: 'Video Production',
    title: 'Brand Film',
    priceLabel: '₹35,000',
    cadence: '/ film',
    blurb: 'A 1–2 minute hero film for your website, pitch deck, or ads. Cinematic, intentional, made to last.',
    bullets: [
      '1–2 min film, full concept development',
      'Multi-day shoot with scripted scenes',
      'Edit, colour grade, sound, motion',
      'Master + cutdowns for socials',
    ],
    bestFor: 'Founder narratives · Brand launches · Anchor assets',
  },
]

/* Bundled monthly plans — replace the older "Retainers + à la carte add-ons"
   pricing. Each plan stacks the previous one's deliverables, so the buyer's
   decision becomes a clean A/B/C ladder instead of mix-and-match. */
const MONTHLY_PLANS = [
  {
    letter: 'Plan A',
    name: 'Social Presence',
    priceLabel: '₹20,000',
    cadence: '/ month',
    tagline: 'A reliable monthly cadence of content + community.',
    bullets: [
      '9 photos + 3 reels per month',
      '3–4 stories per week from shoot content',
      'Daily comment & DM replies (business hours)',
    ],
    bestFor: 'Restaurants establishing a consistent feed',
  },
  {
    letter: 'Plan B',
    name: 'Social + Reputation',
    priceLabel: '₹30,000',
    cadence: '/ month',
    tagline: 'Plan A, plus your aggregator + Google footprint.',
    bullets: [
      'Everything in Plan A',
      'Zomato / Swiggy profile shoot & optimisation',
      'Google Business Profile management',
      'Review responses (Google + Zomato + Swiggy)',
    ],
    bestFor: 'Established brands ready to own search + reviews',
  },
  {
    letter: 'Plan C',
    name: 'Full Growth Retainer',
    priceLabel: '₹40,000',
    cadence: '/ month',
    tagline: 'Plan B, plus strategy + premium turnaround.',
    bullets: [
      'Everything in Plan B',
      'Strategy + content calendar + analytics',
      '4+ reels per month with concepts',
      'Priority turnaround on requests',
      'Private client portal access',
    ],
    bestFor: 'Scaling brands treating content as a growth channel',
  },
]

/* ─────────────────────────────────────────────
   DOCUMENT
───────────────────────────────────────────── */

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
  info: {
    Title: 'P2V Labs — Pricing',
    Author: 'P2V Labs',
    Subject: 'Pricing guide for video, photography, and content retainers',
    Keywords: 'p2v labs, pricing, content agency, ahmedabad, video, photography',
    CreationDate: new Date('2026-06-17T10:00:00+05:30'),
  },
})

/* Register every font once so subsequent doc.font('serif-bold') calls
   resolve. PDFKit loads the TTF, embeds a subset in the PDF, and Unicode
   glyphs (₹, →, ·, em-dashes) render correctly. */
Object.entries(FONTS).forEach(([name, path]) => doc.registerFont(name, path))

doc.pipe(fs.createWriteStream(OUTPUT_PATH))

/* ─────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────── */

function cream() {
  doc.save()
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(CREAM)
  doc.restore()
}

function eyebrow(text, x, y, opts = {}) {
  const { color = CHARCOAL, opacity = 0.45, size = 8 } = opts
  doc.save()
  doc.fillColor(color, opacity)
  doc.font('sans-bold').fontSize(size)
  doc.text(text.toUpperCase(), x, y, { characterSpacing: 2.5, ...opts.textOpts })
  doc.restore()
}

function hairline(x1, y1, x2, y2, opts = {}) {
  const { color = HAIRLINE, opacity = 0.15, width = 0.5 } = opts
  doc.save()
  doc.strokeColor(color, opacity).lineWidth(width)
  doc.moveTo(x1, y1).lineTo(x2, y2).stroke()
  doc.restore()
}

function redAccent(x, y, length = 60) {
  doc.save()
  doc.strokeColor(RED, 1).lineWidth(1.5)
  doc.moveTo(x, y).lineTo(x + length, y).stroke()
  doc.restore()
}

function headline(text, x, y, opts = {}) {
  const { size = 40, color = CHARCOAL, italic = false, opacity = 1 } = opts
  doc.save()
  doc.fillColor(color, opacity)
  doc.font(italic ? 'serif-bi' : 'serif-bold').fontSize(size)
  doc.text(text, x, y, { ...opts.textOpts })
  doc.restore()
}

function body(text, x, y, opts = {}) {
  const { size = 10, color = CHARCOAL, opacity = 0.65, width, lineGap = 3 } = opts
  doc.save()
  doc.fillColor(color, opacity)
  doc.font('sans').fontSize(size)
  const w = width ?? PAGE_W - MARGIN - x
  doc.text(text, x, y, { width: w, lineGap, ...opts.textOpts })
  doc.restore()
}

function priceTag(label, cadence, x, y) {
  doc.save()
  /* "From" eyebrow */
  doc.fillColor(CHARCOAL, 0.4).font('sans-bold').fontSize(7)
  doc.text('FROM', x, y, { characterSpacing: 2 })
  /* Price in red Times-Bold */
  doc.fillColor(RED, 1).font('serif-bold').fontSize(22)
  doc.text(label, x, y + 10)
  const priceWidth = doc.widthOfString(label)
  /* Cadence in small charcoal */
  doc.fillColor(CHARCOAL, 0.5).font('sans').fontSize(9)
  doc.text(cadence, x + priceWidth + 6, y + 23)
  doc.restore()
}

/* ─────────────────────────────────────────────
   PAGE: COVER
───────────────────────────────────────────── */

function renderCover() {
  cream()

  /* Top bar */
  redAccent(MARGIN, MARGIN + 30, 100)
  eyebrow('P2V LABS', MARGIN, MARGIN + 50, { opacity: 0.7, size: 9 })
  eyebrow('Pixels · Purpose · Visuals', MARGIN, MARGIN + 65, { opacity: 0.4, size: 7.5 })

  /* Date — top-right */
  eyebrow('Pricing · June 2026', MARGIN, MARGIN + 50, {
    opacity: 0.4, size: 8,
    textOpts: { width: PAGE_W - MARGIN * 2, align: 'right' },
  })

  /* Center block — big editorial headline */
  const headlineY = 280
  eyebrow('Pricing', MARGIN, headlineY, { color: RED, opacity: 1, size: 9 })
  headline('Transparent', MARGIN, headlineY + 22, { size: 64 })
  headline('starts.', MARGIN, headlineY + 88, { size: 64 })
  headline('Scope shapes', MARGIN, headlineY + 160, { size: 38, italic: true, color: RED })
  headline('the rest.', MARGIN, headlineY + 200, { size: 38, italic: true, color: RED })

  /* Bottom — talk-to-us block */
  const ctaY = PAGE_H - 150
  hairline(MARGIN, ctaY, PAGE_W - MARGIN, ctaY)
  eyebrow('Talk to us', MARGIN, ctaY + 18, { opacity: 0.4, size: 7.5 })
  doc.fillColor(CHARCOAL, 0.85).font('serif-bold').fontSize(13)
  doc.text('hello@p2vlabs.in   ·   +91 70488 24616', MARGIN, ctaY + 36)
  doc.fillColor(CHARCOAL, 0.55).font('sans').fontSize(9)
  doc.text('www.p2vlabs.in/packages   ·   Studio in Ahmedabad, India', MARGIN, ctaY + 60)
}

/* ─────────────────────────────────────────────
   PACKAGE ROW — re-used across pages
───────────────────────────────────────────── */

function renderPackage(pkg, y) {
  /* Eyebrow + title row */
  eyebrow(pkg.category, MARGIN, y, { opacity: 0.5, size: 7 })
  doc.fillColor(CHARCOAL, 1).font('serif-bold').fontSize(24)
  doc.text(pkg.title, MARGIN, y + 14)

  /* Price — top right */
  priceTag(pkg.priceLabel, pkg.cadence, PAGE_W - MARGIN - 180, y)

  /* Blurb */
  if (pkg.blurb) {
    body(pkg.blurb, MARGIN, y + 50, {
      opacity: 0.65, size: 10,
      width: PAGE_W - MARGIN * 2,
      lineGap: 2,
    })
  }

  /* Bullets */
  const bulletStartY = y + (pkg.blurb ? 90 : 50)
  pkg.bullets.forEach((b, i) => {
    const by = bulletStartY + i * 16
    /* Red arrow */
    doc.fillColor(RED, 1).font('sans').fontSize(10)
    doc.text('→', MARGIN, by)
    /* Bullet text */
    doc.fillColor(CHARCOAL, 0.75).font('sans').fontSize(10)
    doc.text(b, MARGIN + 14, by, { width: PAGE_W - MARGIN * 2 - 14, lineGap: 1 })
  })

  /* Best-for line + bottom hairline. We measure the eyebrow's actual
     width (it has letter-spacing so a fixed-pixel offset under-counts)
     and position the categories text after it + a 14pt gap. */
  const bottomY = bulletStartY + pkg.bullets.length * 16 + 10
  if (pkg.bestFor) {
    const label = 'BEST FOR'
    doc.save()
    doc.fillColor(CHARCOAL, 0.4).font('sans-bold').fontSize(7)
    doc.text(label, MARGIN, bottomY + 2, { characterSpacing: 2.5 })
    const lw = doc.widthOfString(label, { characterSpacing: 2.5 })
    doc.restore()

    doc.fillColor(CHARCOAL, 0.6).font('sans').fontSize(9.5)
    doc.text(pkg.bestFor, MARGIN + lw + 14, bottomY, { lineGap: 1 })
  }

  const lineY = bottomY + 22
  hairline(MARGIN, lineY, PAGE_W - MARGIN, lineY)
  return lineY  // bottom y so caller can space next item
}

/* ─────────────────────────────────────────────
   SECTION HEADER — used at the top of pages 2-5
───────────────────────────────────────────── */

function renderSectionHeader(eyebrowText, headlineText, italicTail, y = MARGIN + 10) {
  eyebrow(eyebrowText, MARGIN, y, { color: RED, opacity: 1, size: 8.5 })
  headline(headlineText, MARGIN, y + 20, { size: 28 })
  if (italicTail) {
    const w = doc.widthOfString(headlineText)
    headline(italicTail, MARGIN + w + 8, y + 20, { size: 28, italic: true, color: RED })
  }
  hairline(MARGIN, y + 70, PAGE_W - MARGIN, y + 70)
  return y + 90  // bottom y of section header
}

/* ─────────────────────────────────────────────
   PAGE: PROJECT-BASED PACKAGES
───────────────────────────────────────────── */

function renderProjectPackages() {
  doc.addPage()
  cream()
  let y = renderSectionHeader('Project-Based', 'One-off shoots,', 'one-off films.')
  PROJECT_PACKAGES.forEach((pkg) => {
    y = renderPackage(pkg, y + 18) + 0
  })
}

/* ─────────────────────────────────────────────
   PAGE: BUNDLED MONTHLY PLANS — A/B/C side by side
───────────────────────────────────────────── */

function renderBundledPlans() {
  doc.addPage()
  cream()
  let y = renderSectionHeader('Monthly Plans', 'Three ways', 'to grow.')

  y += 2
  /* Intro sub-line */
  doc.fillColor(CHARCOAL, 0.55).font('sans').fontSize(10.5)
  doc.text(
    'Pick one bundle a month — content cadence, reputation, and strategy scale together as you climb tiers.',
    MARGIN, y,
    { width: PAGE_W - MARGIN * 2, lineGap: 2 }
  )
  y += 38

  /* Three columns. Gutters are narrower than card width so the cards
     read as a single pricing comparison row. */
  const GUTTER = 14
  const colW = (PAGE_W - MARGIN * 2 - GUTTER * 2) / 3

  /* Pre-compute the tallest bullet block across all three plans so the
     footers (hairline + Best for) line up horizontally across columns.
     Bullets that wrap to two lines use more vertical space than ones
     that don't — without this we'd get staggered footers. */
  const bulletInnerW = colW - 14
  const maxBulletBlock = Math.max(
    ...MONTHLY_PLANS.map((p) => measureBulletBlock(p.bullets, bulletInnerW))
  )

  MONTHLY_PLANS.forEach((plan, i) => {
    const x = MARGIN + i * (colW + GUTTER)
    renderPlanCard(plan, x, y, colW, maxBulletBlock)
  })
}

const BULLET_GAP = 6              // vertical gap between bullets
const BULLET_LINE_HEIGHT = 13     // approx height of one wrapped line
function measureBulletBlock(bullets, w) {
  doc.font('sans').fontSize(9.5)
  return bullets.reduce((sum, b) => {
    const h = doc.heightOfString(b, { width: w, lineGap: 2 })
    return sum + Math.max(h, BULLET_LINE_HEIGHT) + BULLET_GAP
  }, 0)
}

function renderPlanCard(plan, x, y, w, alignedBulletBlockH) {
  /* Top hairline — visually separates each plan column from the section
     header above and signals "this is a card". */
  hairline(x, y, x + w, y, { opacity: 0.22, width: 1 })

  /* Plan letter eyebrow (red) */
  doc.fillColor(RED, 1).font('sans-bold').fontSize(8.5)
  doc.text(plan.letter.toUpperCase(), x, y + 16, { characterSpacing: 3 })

  /* Plan name — large serif. Tier name is the heading. */
  doc.fillColor(CHARCOAL, 1).font('serif-bold').fontSize(17)
  doc.text(plan.name, x, y + 34, { width: w, lineGap: 1 })

  /* Price block — large red, cadence small charcoal. */
  doc.fillColor(RED, 1).font('serif-bold').fontSize(24)
  doc.text(plan.priceLabel, x, y + 88)
  const priceW = doc.widthOfString(plan.priceLabel)
  doc.fillColor(CHARCOAL, 0.5).font('sans').fontSize(9.5)
  doc.text(plan.cadence, x + priceW + 4, y + 103)

  /* Hairline under price — separates "what it costs" from "what's in it". */
  hairline(x, y + 132, x + w, y + 132, { opacity: 0.10 })

  /* Tagline — italic serif. */
  doc.fillColor(CHARCOAL, 0.65).font('serif-italic').fontSize(10)
  doc.text(plan.tagline, x, y + 146, { width: w, lineGap: 2 })

  /* Bullets — stacked dynamically based on actual rendered height
     (some wrap to 2 lines). */
  const bulletStart = y + 196
  let cy = bulletStart
  plan.bullets.forEach((b) => {
    doc.fillColor(RED, 1).font('sans').fontSize(10)
    doc.text('→', x, cy)
    doc.fillColor(CHARCOAL, 0.78).font('sans').fontSize(9.5)
    const bh = doc.heightOfString(b, { width: w - 14, lineGap: 2 })
    doc.text(b, x + 14, cy, { width: w - 14, lineGap: 2 })
    cy += Math.max(bh, BULLET_LINE_HEIGHT) + BULLET_GAP
  })

  /* Best-for footer — positioned using the SHARED tallest bullet block
     so all three columns' footers align horizontally even when the
     plans have different bullet counts / wrap behaviour. */
  const footerY = bulletStart + alignedBulletBlockH + 14
  hairline(x, footerY - 8, x + w, footerY - 8, { opacity: 0.10 })
  doc.fillColor(CHARCOAL, 0.4).font('sans-bold').fontSize(7)
  doc.text('BEST FOR', x, footerY, { characterSpacing: 2.5 })
  doc.fillColor(CHARCOAL, 0.6).font('sans').fontSize(9)
  doc.text(plan.bestFor, x, footerY + 14, { width: w, lineGap: 2 })
}

/* ─────────────────────────────────────────────
   PAGE: PROCESS + CONTACT
───────────────────────────────────────────── */

function renderProcessAndContact() {
  doc.addPage()
  cream()
  let y = renderSectionHeader('How We Work', 'Brief.', 'Shoot. Deliver.')

  y += 8
  const steps = [
    {
      n: '01', title: 'Brief',
      detail: 'A short call (or WhatsApp) to align on scope, deliverables, and timelines. We send a written quote within one business day.',
    },
    {
      n: '02', title: 'Shoot',
      detail: 'Production day at your venue — set up, capture, on-the-spot review. Tight, fast, deliberate. We bring lighting, crew, and direction; you bring access and the brief.',
    },
    {
      n: '03', title: 'Deliver',
      detail: 'Edited files in 5–7 working days. Two rounds of revisions within the scope. Final assets land in your private portal at clients.p2vlabs.in.',
    },
  ]

  steps.forEach((s) => {
    /* Number — large faded */
    doc.fillColor(RED, 0.4).font('serif-bold').fontSize(36)
    doc.text(s.n, MARGIN, y)

    doc.fillColor(CHARCOAL, 1).font('serif-bold').fontSize(20)
    doc.text(s.title, MARGIN + 70, y + 4)

    doc.fillColor(CHARCOAL, 0.6).font('sans').fontSize(10)
    doc.text(s.detail, MARGIN + 70, y + 32, {
      width: PAGE_W - MARGIN * 2 - 70,
      lineGap: 2,
    })

    y += 92
    hairline(MARGIN, y - 12, PAGE_W - MARGIN, y - 12)
  })

  /* ── Proof bar — four hard numbers that close the sale. Sits between
        the process and the CTA so the buyer sees "here's how we work"
        → "here's the receipt" → "here's the ask". Without this the
        bottom half of the page was just whitespace. */
  const proofY = y + 32
  const stats = [
    { num: '150+', label: 'Restaurant shoots' },
    { num: '5M+',  label: 'Views across client reels' },
    { num: '90%',  label: 'Plan renewal rate' },
    { num: '7d',   label: 'Avg delivery turnaround' },
  ]
  const statColW = (PAGE_W - MARGIN * 2) / stats.length
  hairline(MARGIN, proofY, PAGE_W - MARGIN, proofY, { opacity: 0.20 })
  stats.forEach((s, i) => {
    const x = MARGIN + i * statColW
    doc.fillColor(RED, 1).font('serif-bold').fontSize(30)
    doc.text(s.num, x, proofY + 18, { width: statColW, align: 'center' })
    doc.fillColor(CHARCOAL, 0.5).font('sans-bold').fontSize(7)
    doc.text(s.label.toUpperCase(), x, proofY + 60, {
      width: statColW, align: 'center', characterSpacing: 1.8,
    })
  })
  hairline(MARGIN, proofY + 92, PAGE_W - MARGIN, proofY + 92, { opacity: 0.20 })

  /* Closing CTA — sits just below the proof bar, no longer floating in
     empty space. */
  const ctaY = proofY + 124
  eyebrow('Not sure which fits?', MARGIN, ctaY, { color: RED, opacity: 1, size: 8.5 })
  headline('Send the brief.', MARGIN, ctaY + 18, { size: 26 })
  headline('We\'ll shape the rest.', MARGIN, ctaY + 48, { size: 26, italic: true, color: RED })

  /* Contact line — pinned to the bottom of the page. */
  const contactY = PAGE_H - 100
  hairline(MARGIN, contactY, PAGE_W - MARGIN, contactY)
  doc.fillColor(CHARCOAL, 0.85).font('serif-bold').fontSize(13)
  doc.text('hello@p2vlabs.in   ·   +91 70488 24616', MARGIN, contactY + 16)
  doc.fillColor(CHARCOAL, 0.5).font('sans').fontSize(9)
  doc.text('www.p2vlabs.in   ·   Studio in Ahmedabad, India', MARGIN, contactY + 38)

  /* Brand mark — italic red, bottom-right. */
  doc.fillColor(RED, 0.85).font('serif-bi').fontSize(11)
  doc.text('P2V Labs', MARGIN, PAGE_H - 35, {
    width: PAGE_W - MARGIN * 2, align: 'right',
  })
}

/* ─────────────────────────────────────────────
   BUILD
───────────────────────────────────────────── */

renderCover()
renderBundledPlans()       // Monthly Plans first — primary commerce surface
renderProjectPackages()    // One-off shoots second — secondary path
renderProcessAndContact()

doc.end()

doc.on('end', () => {
  console.log(`✓ Pricing PDF written to ${OUTPUT_PATH}`)
})
