import { Playfair_Display, Inter } from 'next/font/google'
import RootClient from '../components/layout/RootClient.jsx'
import { SITE_URL, SITE_NAME, SITE_LOCALE, organizationJsonLd } from '../lib/seo.js'
import './globals.css'

/**
 * Next.js Font Optimization — self-hosts Playfair Display + Inter so we get a
 * single woff2 per family with `font-display: swap`, instead of the Vite app's
 * render-blocking <link rel="stylesheet"> from fonts.googleapis.com.
 *
 * Both fonts are exposed as CSS custom properties (--font-playfair, --font-inter)
 * which the Tailwind theme + globals.css reference.
 */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  style:  ['normal', 'italic'],
  variable: '--font-playfair',
  display:  'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display:  'swap',
})

export const metadata = {
  /* metadataBase is the canonical host. Every relative URL in this
   * file (canonicals, og:image, twitter:image) gets resolved against
   * this. Non-www, https — matches the redirect direction in vercel.json
   * + the SITE_URL constant in lib/seo.js. Change one, change all. */
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'P2V Labs — Visual Content Agency Ahmedabad',
    template: '%s | P2V Labs',
  },
  alternates: { canonical: '/' },
  description:
    'P2V Labs is a visual content agency based in Ahmedabad, Gujarat specialising in video production, product photography, food photography, corporate films, and social media content.',
  keywords: [
    'content agency Ahmedabad',
    'video production Ahmedabad',
    'product photography Ahmedabad',
    'food photography Gujarat',
    'corporate video Ahmedabad',
    'reels agency Gujarat',
    'photography studio Ahmedabad',
  ],
  authors: [{ name: 'P2V Labs' }],
  creator: 'P2V Labs',
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: '/',                  /* resolved against metadataBase → SITE_URL */
    siteName: SITE_NAME,
    title: 'P2V Labs — Visual Content Agency Ahmedabad',
    description:
      'Pixels · Purpose · Visuals — Data-driven visual content for businesses across Gujarat.',
    images: [{
      url: '/og-image.jpg',    /* resolved → https://p2vlabs.in/og-image.jpg */
      width: 1200,
      height: 630,
      alt: 'P2V Labs — Visual Content Agency Ahmedabad',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'P2V Labs — Visual Content Agency Ahmedabad',
    description: 'Pixels · Purpose · Visuals',
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
    /* Brand-red square with cream "P2V" — readable when Google downscales
     * it for the favicon column. favicon.ico (32+48) is the legacy +
     * Google fallback at the root path; icon.png (512) is the PWA/raster
     * source; the SVG is the crisp vector for modern browsers. All three
     * regenerated from /public/icons/icon.svg via scripts/gen-favicons.mjs. */
    icon: [
      { url: '/favicon.ico',        sizes: '32x32 48x48' },
      { url: '/icon.png',           type: 'image/png', sizes: '512x512' },
      { url: '/icons/icon.svg',     type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',       // legacy <link rel="shortcut icon">
    apple:    '/apple-icon.png',    // 180×180 iOS home-screen icon
  },
}

export const viewport = {
  themeColor: '#F5F0E8',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-cream">
        {/* Organization JSON-LD — every page carries the publisher entity.
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
