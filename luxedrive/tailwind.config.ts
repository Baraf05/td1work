import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        bg:        '#0A0A0B',
        surface:   '#111113',
        gold:      '#C9A96E',
        primary:   '#F5F2EE',
        secondary: '#A8A49E',
        muted:     '#5A5855',
        hint:      '#3A3836',
      },
    },
  },
  plugins: [],
}
export default config
