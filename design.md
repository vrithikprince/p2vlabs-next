# P2V Labs — Design System

> **Active palette:** Editorial Cream
> **Last updated:** 2026-05-22
> **Repo:** vrithikprince/p2vlabs-next

This file is the source of truth for the visual system. When swapping
palettes, hand this file (or a specific section) to a Claude session
and say *"switch the site to the {section name} system"*. Each system
is fully self-contained: tokens, typography, components, references.

---

## Table of contents

1. [Current — Editorial Cream](#current--editorial-cream)
2. [Previous — After Hours](#previous--after-hours-attempted-2026-05-22-reverted-2026-05-22)
3. [Cross-system rules](#cross-system-rules)

---

# Current — Editorial Cream

Editorial / Loewe / A24-inspired. Warm cream primary surface, charcoal
body, single saturated red accent. The brand mark uses red for
emphasis — italic words ("Done *Right*"), CTA fills, decorative rules.

## Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `cream` | `#F5F0E8` | Primary surface — page background |
| `warm-white` | `#FAFAF7` | Slightly lighter card surface |
| `charcoal` | `#1a1a1a` | Primary text, dark sections (Contact band, Footer), borders |
| `p2v` | `#c0392b` | Brand red — CTA fills, italic emphasis, accent rules |
| `brand.red-dark` | `#a93226` | p2v hover (rare — most hovers go to `charcoal`) |
| `brand.red-light` | `#e74c3c` | p2v subtle variant |
| `muted` | `#888888` | Subtitle / placeholder text |
| `p2v-border` | `#E8E4DC` | Editorial card borders |

### Tailwind config

```js
// tailwind.config.js → theme.extend.colors
colors: {
  cream:    '#F5F0E8',
  charcoal: '#1a1a1a',
  p2v:      '#c0392b',
  brand: {
    red:        '#c0392b',
    'red-dark': '#a93226',
    'red-light': '#e74c3c',
  },
  'warm-white': '#FAFAF7',
  muted:        '#888888',
  'p2v-border': '#E8E4DC',
}
```

Border opacities are applied inline (`border-charcoal/12`, `border-charcoal/25`)
rather than as named tokens — gives flexibility without proliferating
tokens.

## Typography

- **Display**: Playfair Display (400, 500, 700, 900, italic). Used for
  H1, H2, H3, hero headlines, the wordmark.
- **Body**: Inter (300, 400, 500, 600). Used for paragraph text,
  labels, captions, button text.

Loaded via `next/font/google` in `app/layout.jsx` — self-hosted woff2,
no render-blocking external request.

### Scale

| Use | Class |
|---|---|
| Hero H1 (Landing) | `font-display text-[clamp(3rem,9vw,7.5rem)] leading-[1.05] tracking-tight` |
| Blog post H1 | `font-display text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.08]` |
| Section H2 | `font-display text-4xl md:text-5xl font-bold leading-tight` |
| Card H3 | `font-display text-xl md:text-2xl font-bold leading-tight` |
| Editorial label | `text-[10px] tracking-[0.4em] uppercase text-charcoal/45` |
| Body paragraph | `text-base md:text-lg leading-relaxed text-charcoal/88` |
| Secondary body | `text-charcoal/55` |

## Component patterns

### Surface hierarchy

- **Page background**: `bg-cream` (everywhere by default — `<body>` carries it)
- **Card / panel**: `bg-cream border border-charcoal/10` or `bg-warm-white`
- **Dark band moment** (Contact, Footer): `bg-charcoal text-cream`

### CTAs

- **Primary**: `bg-p2v text-cream hover:bg-charcoal transition-colors` —
  red filled pill that darkens to charcoal on hover.
- **Secondary**: `border border-charcoal/20 text-charcoal hover:border-charcoal/50`
- **Tertiary / link**: `text-charcoal/40 hover:text-p2v transition-colors`

### Accent moments

Brand red (`p2v`) is the system's chromatic moment. Used for:

- The italic emphasis word in a headline: `<em class="not-italic text-p2v">Done Right.</em>`
- The thin red rule under section headings: `<div class="w-8 h-px bg-p2v" />`
- The play button on VlogCard / VlogPlayer (red filled circle)
- Primary CTA fill: `bg-p2v text-cream`
- Editorial italic links inside articles: `.tiptap-link { color: #c0392b }`

### Loader

The liquid brand-reveal loader: charcoal screen → glass sweeps across
→ cream wash bleeds in behind it → "P2V Labs" white text bleeds into
deep crimson via SVG turbulence/displacement filter. Settles to a
cream page beneath. (See `components/layout/Loader.jsx` + `app/globals.css → #liquid-loader`.)

### Forms

- Input field: `bg-transparent border border-charcoal/15 text-charcoal placeholder-charcoal/35 focus:border-charcoal`
- Chip (multi-select for service interest etc.): `border border-charcoal/18 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal` (idle) → `bg-charcoal text-cream border-charcoal` (active)
- Submit button: primary CTA pattern above (`bg-p2v text-cream hover:bg-charcoal`)

### Photography & video

Photography in the Reel + on blog covers needs to pop against the
warm cream backdrop. Borders around photos use `border-charcoal/10`
(1px, low opacity).

## Hard NO list

- No dark/purple-blue gradients.
- No glassmorphism in product UI (loader is the one allowed exception).
- No neon, no particle fields, no animated blobs.
- No generic AI-SaaS aesthetic.
- No mock data anywhere.

## File map (where colour lives)

| Layer | File | Responsibility |
|---|---|---|
| Tokens | `tailwind.config.js` | All named colour tokens |
| Globals | `app/globals.css` | Body bg, scrollbar, autofill, cursor, loader CSS, blog-article (Tiptap-rendered HTML) styles |
| Layout chrome | `components/layout/*.jsx` | Navbar, Footer, BottomNav, FloatingWhatsApp, Loader, CustomCursor, ScrollToTop, Marquee, ShutterTransition |
| Sections | `components/landing/*.jsx` | Hero, Services, ReelPreview, AboutSection, ContactSection |
| Detail pages | `components/blog/*.jsx`, `components/vlog/*.jsx` | BlogArticle, BlogCard, VlogCard, VlogPlayer, DroppingSoon, PostCTA |
| Forms | `components/ui/LeadForm.jsx`, `LeadFormModal.jsx` | Lead capture |
| Reel | `components/reel/*.jsx`, `app/reel/page.jsx` | Portfolio grid |
| SEO assets | `public/icon.png`, `apple-icon.png`, `og-image.jpg` | Square brand mark + OG share card — `p2v` red bg + `cream` text |

## Image generation specs

When regenerating with PowerShell + System.Drawing:

- **og-image.jpg** (1200×630): `bg = #c0392b` (p2v red), title "P2V Labs" centred in Georgia 140pt bold cream `rgb(245,240,232)`, subtitle "PIXELS · PURPOSE · VISUALS" 22pt Arial regular cream at ~86% opacity.
- **icon.png** (192×192): `bg = #c0392b` (p2v red), "P2V" centred Georgia ~92pt bold cream. No subtitle (unreadable at 16×16).
- **apple-icon.png** (180×180): same design as icon.png.

---

# Previous — After Hours (attempted 2026-05-22, reverted 2026-05-22)

> **Why archived:** Shipped a cinematic-dark palette swap to differentiate
> from the Anthropic-cream-and-red family the Editorial Cream system
> shared. Reverted within hours — Vrithik didn't like the feel.
>
> **To re-apply:** give this section to a Claude session with the
> message *"Switch the P2V Labs design system to the After Hours
> palette spec'd in design.md. Update tailwind.config.js, globals.css,
> every component file, and regenerate og-image.jpg + icon.png +
> apple-icon.png with the colours below."*

Cinematic dark. The site primary surface near-black; cream/bone
reserved for typography and the occasional inverted band. A single
restrained chromatic accent (warm amber) appears in italics, rules,
and decorative moments — never as the default CTA fill.

## Tokens

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | Primary surface — page background |
| `pitch` | `#16140F` | Secondary surface — cards, bands, modals |
| `paper` | `#1A1813` | Tertiary surface — long-form reading body |
| `bone` | `#EAE5DA` | Primary text on dark; high-contrast CTA fill; logo wordmark |
| `smoke` | `#9A9389` | Secondary text on dark — captions, labels |
| `mist` | `#6B655D` | Tertiary text — copyright, ultra-quiet metadata |
| `amber` | `#D4A04E` | Accent — italic emphasis words, rules, hover states |
| `amber-deep` | `#A87A2E` | Hover state for `amber`-coloured elements |

### Tailwind config (re-apply reference)

```js
colors: {
  ink:          '#0A0A0A',
  pitch:        '#16140F',
  paper:        '#1A1813',
  bone:         '#EAE5DA',
  smoke:        '#9A9389',
  mist:         '#6B655D',
  amber:        '#D4A04E',
  'amber-deep': '#A87A2E',
}
```

## Component patterns (re-apply reference)

- **Page bg**: `bg-ink`
- **Body text on dark**: `text-bone` (with `/85`, `/65`, `/55` opacities for hierarchy) OR `text-smoke` for secondary
- **Border**: `border-bone/12` to `border-bone/25`
- **Primary CTA**: `bg-bone text-ink hover:bg-amber transition-colors` — luxury bone pill, amber hover
- **Secondary CTA**: `border border-bone/30 text-bone hover:border-bone hover:text-amber`
- **Italic emphasis**: `<em class="not-italic text-amber">…</em>`
- **Dark band moment** (Contact, Footer): `bg-pitch` (slightly lifted from ink — subtle band)
- **Reading band** (blog article body): `bg-paper` (slightly lifted from ink for reading comfort)
- **Editorial label**: `text-[10px] tracking-[0.4em] uppercase text-smoke`
- **Loader**: ink screen → glass sweep → bone "P2V Labs" base + amber bleed layer via the same SVG turbulence/displacement filter. Wash colour `pitch` (near-invisible lift, not the cream wash from Editorial Cream).
- **Cursor**: amber dot + amber/55 ring (not red as in Editorial Cream)
- **Shutter strips**: bone strips on ink page (inverted — they were dark strips on cream page in Editorial Cream)
- **Scroll-to-top button**: bone pill, ink chevron, amber hover

## Image generation (re-apply reference)

- **icon.png** (192×192): `bg = #0A0A0A` (ink), "P2V" centred Georgia 92pt bold `#EAE5DA` (bone). No subtitle.
- **apple-icon.png** (180×180): same as icon.png.
- **og-image.jpg** (1200×630): `bg = #0A0A0A` (ink), title "P2V Labs" Georgia 140pt bold `#EAE5DA` (bone), subtitle "PIXELS · PURPOSE · VISUALS" 22pt Arial `#D4A04E` (amber). Decorative amber rule under title at y=395px, x=540-660.

---

# Cross-system rules

These survive every palette swap:

- **Fonts**: Playfair Display (display) + Inter (sans), via `next/font/google`. Never change without a hard reason — they're the most stable element of the brand.
- **Editorial label pattern**: `text-[10px] tracking-[0.4em] uppercase text-{secondary-text-token}/45` — appears above every section heading. Only the colour token changes per palette.
- **`clip-wrap` + GSAP word-clip entrance**: visual signature of the brand, palette-agnostic.
- **Marquee, Shutter transition, Custom cursor, Sticky-stacking service cards**: all GSAP-driven motion patterns survive palette swaps — only colour tokens inside them change.
- **Image treatment in Reel + Blog covers**: never tinted, never filtered. Photography speaks; the brand frames it.
- **Hard NO list (palette-independent)**:
  - No glassmorphism in product UI (loader's glass sweep is the one allowed exception).
  - No gradient buttons.
  - No neon, no particle fields, no animated blobs.
  - No mock data anywhere.
  - No generic AI-SaaS tropes (hero-with-three-feature-cards, etc.).

---

*Maintained alongside the codebase. When you ship a palette swap,
update the "Current —" section to reflect what's live and move the
previous system into the appropriate "Previous —" archive below.*
