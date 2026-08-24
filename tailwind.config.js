/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
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
        /* Amplitude-inspired design system - namespaced under `amp-` so it
           layers on top of the existing cream/charcoal/red tokens above
           (still used by pages this refactor doesn't touch) rather than
           redefining them out from under those pages. */
        'amp-cobalt':      '#1e61f0',
        'amp-navy':        '#001a4f',
        'amp-violet':      '#a273ff',
        'amp-periwinkle':  '#6980ff',
        'amp-ink-pill':    '#1a1f23',
        'amp-body':        '#333333',
        'amp-caption':     '#565656',
        'amp-hairline':    '#d5d9e0',
        'amp-hairline-strong': '#9fa5ad',
        'amp-surface':     '#f2f4f8',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'DM Sans', 'system-ui', 'sans-serif'],
        plex:    ['var(--font-plex)', 'Arial', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display':    ['4.5rem', { lineHeight: '1.1' }],
        'display-sm': ['3rem',   { lineHeight: '1.15' }],
      },
    },
  },
  plugins: [],
}
