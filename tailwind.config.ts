import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:   '#FAF6F1',
        sand:    '#E8DDD0',
        tan:     '#C4A882',
        brown:   '#2C1810',
        'brown-mid': '#5C3D2E',
        sage:    '#7A8C6E',
        'sage-light': '#B5C4A8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Noto Sans TC', 'sans-serif'],
        serif: ['var(--font-serif)', 'Noto Serif TC', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
