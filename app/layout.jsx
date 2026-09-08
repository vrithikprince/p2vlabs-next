import { Inter, IBM_Plex_Sans } from 'next/font/google'
import RootClient from '../components/layout/RootClient.jsx'
import { SITE_URL, SITE_NAME, SITE_LOCALE, organizationJsonLd } from '../lib/seo.js'
import './globals.css'

/**
 * Next.js Font Optimization - self-hosts each family as a single woff2 with
 * `font-display: swap`, instead of a render-blocking <link rel="stylesheet">
 * from fonts.googleapis.com. Each is exposed as a CSS custom property that
 * the Tailwind theme and globals.css reference.
 *
 * Playfair Display was dropped when the site moved to the amp system: after
 * the migration nothing rendered in it, but it was still being downloaded on
 * every page load - a whole webfont's worth of bytes for zero glyphs.
 */
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display:  'swap',
})

/* IBM Plex Sans - the display/UI family across the amp system. Amplitude's
 * own marketing site loads this as its body/label family (Gellix is the
 * licensed face it renders; Plex is the documented open substitute). */
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-plex',
  display:  'swap',
})

export const metadata = {
  /* metadataBase is the canonical host. Every relative URL in this
   * file (canonicals, og:image, twitter:image) gets resolved against
   * this. Non-www, https - matches the redirect direction in vercel.json
   * + the SITE_URL constant in lib/seo.js. Change one, change all. */
  metadataBase: new URL(SITE_URL),
  /* A SUPERSET, not a swap. The site sells website builds, SEO and AI
     search visibility on /packages, but every machine-readable surface
     still said "visual content agency" - so the two halves of the site
     described two different companies, and anything summarising the page
     could only output the older one. The content services are still named
     first; the search half is now named at all. */
  title: {
    default: 'P2V Labs - Content & Search Visibility Studio, Ahmedabad',
    template: '%s | P2V Labs',
  },
  alternates: { canonical: '/' },
  description:
    'P2V Labs is a content and search visibility studio in Ahmedabad, Gujarat. Video production, product and food photography, and social content - plus website builds, SEO and AI search visibility that get brands found on Google and cited by AI answer engines.',
  keywords: [
    'content agency Ahmedabad',
    'video production Ahmedabad',
    'product photography Ahmedabad',
    'food photography Gujarat',
    'corporate video Ahmedabad',
    'reels agency Gujarat',
    'photography studio Ahmedabad',
    /* The search half. Note "AI search optimization" rather than "AEO":
       only ~3% of buyers search the acronym, ~46% search this phrasing. */
    'SEO services Ahmedabad',
    'website development Ahmedabad',
    'AI search optimization India',
    'answer engine optimisation India',
    'GenAI automation Ahmedabad',
  ],
  authors: [{ name: 'P2V Labs' }],
  creator: 'P2V Labs',
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: '/',                  /* resolved against metadataBase → SITE_URL */
    siteName: SITE_NAME,
    title: 'P2V Labs - Content & Search Visibility Studio, Ahmedabad',
    description:
      'Content, websites and search visibility for brands across Gujarat - built to be found on Google and cited by AI.',
    images: [{
      url: '/og-image.jpg',    /* resolved → https://p2vlabs.in/og-image.jpg */
      width: 1200,
      height: 630,
      alt: 'P2V Labs - Content & Search Visibility Studio, Ahmedabad',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'P2V Labs - Content & Search Visibility Studio, Ahmedabad',
    description: 'Content, websites and search visibility. Ahmedabad.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    /* Near-black tile, white "P2V" with a violet "2" - the same mark the
     * loader resolves into and the nav logo shows, so the tab matches the
     * site. Dark rather than white because a white tile disappears into a
     * light browser tab strip.
     *
     * favicon.ico (16+32+48) is the legacy + Google fallback at the root
     * path; icon.png (512) is the PWA/raster source; the SVG is the crisp
     * vector for modern browsers. The 16px entry is drawn from a SEPARATE
     * source (icons/icon-16.svg, a two glyph "P2") because the full three
     * glyph mark is unreadable at that size - see gen-favicons.mjs.
     * Regenerate all of them with: node scripts/gen-favicons.mjs */
    icon: [
      { url: '/favicon.ico',        sizes: '16x16 32x32 48x48' },
      { url: '/icon.png',           type: 'image/png', sizes: '512x512' },
      { url: '/icons/icon.svg',     type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',       // legacy <link rel="shortcut icon">
    apple:    '/apple-icon.png',    // 180×180 iOS home-screen icon
  },
}

export const viewport = {
  /* matches the new white canvas - this paints the mobile browser chrome, so
     leaving it cream put a warm bar above a white page on Android/iOS. */
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${plexSans.variable}`}>
      <body className="min-h-screen bg-white">
        {/* Footer portal target - deliberately the first node in <body>,
            before everything RootClient renders. Footer.jsx portals its
            fixed reveal panel in here so it's earliest in DOM order; every
            other element on the page (default z-index: auto) then paints
            over it naturally on scroll, without relying on negative
            z-index (unreliable on a page full of GSAP-driven transforms,
            which each create their own stacking context). */}
        <div id="footer-portal-root" />
        {/* Organization JSON-LD - every page carries the publisher entity.
            Used by Google for the knowledge panel + as the canonical
            publisher reference on Article schemas across the site. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <RootClient>{children}</RootClient>
      </body>
    </html>
  )
}
