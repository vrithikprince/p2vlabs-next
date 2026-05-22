# P2V Labs — Design System

> **Active palette:** After Hours (cinematic dark)
> **Last updated:** 2026-05-22
> **Repo:** vrithikprince/p2vlabs-next

This file is the source of truth for the visual system. When swapping
palettes, hand this file (or a specific section) to a Claude session
and say *"switch the site to the {section name} system"*. Each system
is fully self-contained: tokens, typography, components, references.

---

## Table of contents

1. [Current — After Hours](#current--after-hours)
2. [Previous — Editorial Cream](#previous--editorial-cream-2026-05-15--2026-05-22)
3. [Cross-system rules](#cross-system-rules)

---

# Current — After Hours

Cinematic dark. The site primary surface is near-black; cream/bone is
reserved for typography and the occasional inverted band. A single
restrained chromatic accent (warm amber) appears in italics, rules,
and decorative moments — never as the default CTA fill.

The rationale: P2V Labs makes video + photography. Dark backgrounds
let the work sit the way film sits in a cinema. Cream-default sites
fight their own portfolio.

## Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | Primary surface — page background, the default behind everything |
| `pitch` | `#16140F` | Secondary surface — cards, the long-form blog reading band, modals |
| `paper` | `#1A1813` | Tertiary surface — only for long-form body where reader fatigue matters (blog article body) |
| `bone` | `#EAE5DA` | Primary text on dark; high-contrast CTA fill; logo wordmark |
| `smoke` | `#9A9389` | Secondary text on dark — captions, labels, meta lines |
| `mist` | `#6B655D` | Tertiary text — copyright, ultra-quiet metadata |
| `amber` | `#D4A04E` | Accent — italic emphasis words ("Done *Right*"), rules, decorative dots, hover states. Never default CTA fill. |
| `amber-deep` | `#A87A2E` | Hover state for `amber`-coloured elements |
| `line` | `rgba(234,229,218,0.12)` | Border default — `bone` at 12% on dark |
| `line-strong` | `rgba(234,229,218,0.25)` | Border emphasis — visible separators |

### Tailwind config

```js
// tailwind.config.js → theme.extend.colors
colors: {
  ink:         '#0A0A0A',
  pitch:       '#16140F',
  paper:       '#1A1813',
  bone:        '#EAE5DA',
  smoke:       '#9A9389',
  mist:        '#6B655D',
  amber:       '#D4A04E',
  'amber-deep': '#A87A2E',
}
```

Border opacities are applied inline (`border-bone/10`, `border-bone/25`)
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
| Editorial label | `text-[10px] tracking-[0.4em] uppercase text-smoke` |
| Body paragraph | `text-base md:text-lg leading-relaxed text-bone/85` |
| Secondary body | `text-charcoal/55` → now `text-smoke` |

## Component patterns

### Surface hierarchy

- **Page background**: `bg-ink` (everywhere by default — `<body>` carries it)
- **Card / panel**: `bg-pitch border border-line` for elevated content
- **Reading band**: `bg-paper` for the blog article body specifically — slightly lifted from `ink` to reduce eye fatigue on long-form reading

### CTAs

- **Primary**: `bg-bone text-ink hover:bg-amber transition-colors` —
  classic luxury "white pill on black" with the warm amber hover for
  cinematic flourish
- **Secondary**: `border border-line-strong text-bone hover:border-bone hover:text-amber`
- **Tertiary / link**: `text-bone underline decoration-line underline-offset-3 hover:decoration-amber`

### Accent moments

Amber is reserved. It earns its colour. Use it for:

- The italic emphasis word in a headline: `<em class="not-italic text-amber">Done Right.</em>`
- The thin red-rule replacement under section headings: `<div class="w-8 h-px bg-amber" />`
- The brand-red play button on VlogCard / VlogPlayer (now `bg-amber/85`)
- The CTA hover state — `hover:bg-amber`
- The Founders Day-1-arrival diamond in the Marquee — was `text-p2v`, now `text-amber`

Never use amber for default body text, default borders, or unaccented surfaces.

### Loader

The liquid brand-reveal loader was originally white → crimson on charcoal.
Under After Hours it reads as: ink bg → glass sweep → bone "P2V Labs"
text settles → faint amber rule materialises below. Same GSAP timeline,
new palette. (See `components/layout/Loader.jsx`.)

### Forms

- Input field: `bg-transparent border border-line text-bone placeholder-smoke/60 focus:border-bone`
- Chip (multi-select for service interest etc.): `border border-line text-smoke hover:border-line-strong hover:text-bone` (idle) → `bg-bone text-ink border-bone` (active)
- Submit button: primary CTA pattern above

### Photography & video

Photography in the Reel + on blog covers naturally pops on dark
backgrounds. **Do not** apply any dark-mode tint / filter to user
photography — the dark surface is the matting. Borders around photos
use `border-line` (1px, low opacity).

## Hard NO list

- No bright primary fills (red, blue, green) — the brand is restrained, not loud.
- No coloured shadows (`rgba(212,160,78,...)`) on floating elements — solid borders or pure dark shadows only.
- No "Anthropic-warm-cream + red accent" combinations — that's the previous system, now retired.
- No gradient buttons or glassmorphism (loader is the one exception, ported from previous system).
- No light-mode sections inside the dark site — if a band needs visual separation, use `bg-pitch` not `bg-bone`.

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
| SEO assets | `public/icon.png`, `apple-icon.png`, `og-image.jpg` | Square brand mark + OG share card — `ink` bg + `bone` text + `amber` accent |

## Image generation specs

When regenerating with PowerShell + System.Drawing:

- **og-image.jpg** (1200×630): `bg = #0A0A0A` (ink), title "P2V Labs" centred in Georgia 140pt bold `#EAE5DA` (bone), subtitle "PIXELS · PURPOSE · VISUALS" 22pt Arial regular `#D4A04E` (amber) at ~75% opacity.
- **icon.png** (192×192): `bg = #0A0A0A` (ink), "P2V" centred Georgia ~92pt bold `#EAE5DA` (bone). No subtitle (unreadable at 16×16).
- **apple-icon.png** (180×180): same design as icon.png.

Generation script lives in conversation history; rebuild with the
PowerShell snippet using these hex values.

---

# Previous — Editorial Cream (2026-05-15 → 2026-05-22)

> **To revert:** give this section to a Claude session with the message
> *"Switch the P2V Labs design system back to the Editorial Cream
> palette spec'd in design.md. Update tailwind.config.js, globals.css,
> every component file, and regenerate og-image.jpg + icon.png +
> apple-icon.png with the colours below."*

Editorial / Loewe / A24-inspired. Warm cream primary surface, charcoal
body, single saturated red accent. Was retired because the
`cream + red` combo read as Claude-adjacent (Anthropic uses the same
warm cream + orange-red family).

## Tokens

| Token | Hex | Use |
|---|---|---|
| `cream` | `#F5F0E8` | Primary surface — page bg |
| `warm-white` | `#FAFAF7` | Slightly lighter card surface |
| `charcoal` | `#1a1a1a` | Primary text, dark sections (Contact band, Footer), borders |
| `p2v` | `#c0392b` | Brand red — CTAs, italic emphasis ("Done *Right.*"), accent rules |
| `brand.red-dark` | `#a93226` | p2v hover |
| `brand.red-light` | `#e74c3c` | p2v subtle variant |
| `muted` | `#888888` | Subtitle / placeholder text |
| `p2v-border` | `#E8E4DC` | Editorial card borders |

### Tailwind config (revert reference)

```js
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

## Component patterns (revert reference)

- **Page bg**: `bg-cream`
- **Body text**: `text-charcoal` (with `/55`, `/65`, `/85` opacities for hierarchy)
- **Border**: `border-charcoal/10` to `border-charcoal/20`
- **Primary CTA**: `bg-p2v text-cream hover:bg-charcoal`
- **Secondary CTA**: `border border-charcoal/20 text-charcoal hover:border-charcoal/50`
- **Italic emphasis**: `<em class="not-italic text-p2v">…</em>`
- **Dark section** (Contact band, Footer): `bg-charcoal text-cream`
- **Reading band**: same `bg-cream` as page (no separate reading surface)
- **Editorial label**: `text-[10px] tracking-[0.4em] uppercase text-charcoal/45`

## Image generation (revert reference)

- og-image.jpg: `bg = #c0392b` (p2v red), title `#EAE5DA` bone, subtitle `rgba(234,229,218,0.86)`.
- icon.png + apple-icon.png: `bg = #c0392b` (p2v red), "P2V" `#EAE5DA` bone.

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
