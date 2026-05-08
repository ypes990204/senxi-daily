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
        // ===== V4 Earthy Botanical 色票（主視覺） =====
        cream:        '#F7F1E8',  // 暖米背景（主）
        'cream-soft': '#FFFCF6',  // 卡片表面
        moss:         '#5C6B47',  // 苔蘚綠（主 CTA、品牌）
        'moss-dark':  '#414D32',  // 苔蘚綠深色（hover）
        terracotta:   '#C97D5D',  // 陶土橘（accent、強調 CTA）
        'terracotta-dark': '#A86344', // hover
        'sand-beige': '#D9C9A9',  // 沙米（次要背景）
        earth:        '#3A2E1F',  // 主文字
        stone:        '#7A6F5C',  // 副文字
        // ===== 既有色票（保留向下相容） =====
        sand:    '#E8DDD0',
        tan:     '#C4A882',
        brown:   '#3A2E1F',       // 等同 earth (色碼一致)
        'brown-mid': '#7A6F5C',   // 等同 stone
        sage:    '#5C6B47',       // 等同 moss
        'sage-light': '#B5C4A8',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Noto Sans TC', 'sans-serif'],
        serif: ['var(--font-serif)', 'Noto Serif TC', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(58, 46, 31, 0.08)',
        'soft-lg': '0 8px 24px -4px rgba(58, 46, 31, 0.10)',
      },
    },
  },
  plugins: [],
}

export default config
