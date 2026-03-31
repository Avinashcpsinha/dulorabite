import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C8973A',
          light: '#E8B96A',
          pale: '#FDF3E3',
        },
        choco: {
          DEFAULT: '#3B1F0E',
          mid: '#6B3A22',
          light: '#A0603A',
        },
        cream: '#FBF6EE',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        dm: ['DM Sans', 'sans-serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
