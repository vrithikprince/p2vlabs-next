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
