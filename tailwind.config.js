/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* After Hours palette (active, see design.md).
         * Cinematic dark. Primary surface ink, type in bone, single
         * amber accent. Bone is the high-contrast CTA fill; amber is
         * the hover/emphasis chroma. */
        ink:          '#0A0A0A',  // primary surface (page bg)
        pitch:        '#16140F',  // secondary surface (cards, bands, modals)
        paper:        '#1A1813',  // tertiary surface (long-form reading body)
        bone:         '#EAE5DA',  // primary text on dark; CTA fill; logo
        smoke:        '#9A9389',  // secondary text on dark
        mist:         '#6B655D',  // tertiary text - captions, copyright
        amber:        '#D4A04E',  // accent - italic emphasis, rules, hover
        'amber-deep': '#A87A2E',  // amber hover state
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif:   ['var(--font-playfair)', 'Georgia', 'serif'],
        sans:    ['var(--font-inter)', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':    ['4.5rem', { lineHeight: '1.1' }],
        'display-sm': ['3rem',   { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
}
