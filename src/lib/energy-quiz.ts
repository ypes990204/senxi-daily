import { Product, MoodTag, LuckTag, Zodiac, Element } from '@/types'
import { PRODUCTS } from './products'

// ===== 心情選項 =====
export const MOOD_OPTIONS: Array<{ value: MoodTag; label: string; emoji: string; sub: string }> = [
  { value: 'anxious', label: '焦慮緊繃', emoji: '😣', sub: '心神不寧、難以放鬆' },
  { value: 'low',     label: '低落沉重', emoji: '🌧',  sub: '情緒沉、想找出口' },
  { value: 'tired',   label: '疲憊耗竭', emoji: '😮‍💨', sub: '能量耗盡、想被療癒' },
  { value: 'angry',   label: '憤怒煩躁', emoji: '🔥',  sub: '情緒湧動、想清空' },
  { value: 'calm',    label: '平靜想沉澱', emoji: '🌿', sub: '想為日常設下儀式感' },
  { value: 'joyful',  label: '喜悅想擴展', emoji: '✨', sub: '能量飽滿、想創造' },
  { value: 'lost',    label: '迷茫不知方向', emoji: '🌫', sub: '想找清晰、做決定' },
]

// ===== 運氣選項 =====
export const LUCK_OPTIONS: Array<{ value: LuckTag; label: string; emoji: string }> = [
  { value: 'unlucky',  label: '近期事事不順',     emoji: '💨' },
  { value: 'romance',  label: '桃花/感情低迷',    emoji: '💕' },
  { value: 'career',   label: '事業/財運卡關',    emoji: '💼' },
  { value: 'health',   label: '健康/精神疲弱',    emoji: '🩺' },
  { value: 'newspace', label: '想轉換新環境/搬家', emoji: '🏠' },
  { value: 'newplan',  label: '想開啟新計畫',      emoji: '🌱' },
]

// ===== 星座與五元素對應 =====
export const ZODIAC_ELEMENT: Record<Zodiac, Element> = {
  aries: 'fire', leo: 'fire', sagittarius: 'fire',
  taurus: 'earth', virgo: 'earth', capricorn: 'earth',
  gemini: 'wind', libra: 'wind', aquarius: 'wind',
  cancer: 'water', scorpio: 'water', pisces: 'water',
}

export const ZODIAC_OPTIONS: Array<{ value: Zodiac; label: string; symbol: string; element: Element }> = [
  { value: 'aries',       label: '牡羊', symbol: '♈', element: 'fire'  },
  { value: 'taurus',      label: '金牛', symbol: '♉', element: 'earth' },
  { value: 'gemini',      label: '雙子', symbol: '♊', element: 'wind'  },
  { value: 'cancer',      label: '巨蟹', symbol: '♋', element: 'water' },
  { value: 'leo',         label: '獅子', symbol: '♌', element: 'fire'  },
  { value: 'virgo',       label: '處女', symbol: '♍', element: 'earth' },
  { value: 'libra',       label: '天秤', symbol: '♎', element: 'wind'  },
  { value: 'scorpio',     label: '天蠍', symbol: '♏', element: 'water' },
  { value: 'sagittarius', label: '射手', symbol: '♐', element: 'fire'  },
  { value: 'capricorn',   label: '摩羯', symbol: '♑', element: 'earth' },
  { value: 'aquarius',    label: '水瓶', symbol: '♒', element: 'wind'  },
  { value: 'pisces',      label: '雙魚', symbol: '♓', element: 'water' },
]

// ===== 元素相容（同元素 1.0、相生 0.7、其他 0.3）=====
const ELEMENT_AFFINITY: Record<Element, Element[]> = {
  fire:  ['fire', 'wood'],          // 木生火
  wood:  ['wood', 'water'],         // 水生木
  earth: ['earth', 'fire'],         // 火生土
  wind:  ['wind', 'water'],         // 風水相親
  water: ['water', 'wind'],
}

function elementScore(productElements: Element[] | undefined, zodiacElement: Element): number {
  if (!productElements || productElements.length === 0) return 0.3
  if (productElements.includes(zodiacElement)) return 1.0
  const affine = ELEMENT_AFFINITY[zodiacElement] ?? []
  if (productElements.some((e) => affine.includes(e))) return 0.7
  return 0.3
}

// ===== 評分函式 =====
function scoreProduct(p: Product, mood: MoodTag, luck: LuckTag, zodiac: Zodiac): number {
  const moodMatch = p.mood_tags?.includes(mood) ? 1 : 0
  const luckMatch = p.luck_tags?.includes(luck) ? 1 : 0
  const elemMatch = elementScore(p.elements, ZODIAC_ELEMENT[zodiac])
  return moodMatch * 0.4 + luckMatch * 0.4 + elemMatch * 0.2
}

// ===== 推薦：每個分類選最高分一件 =====
export interface QuizResult {
  herb: Product
  crystalSet: Product
  energyWand: Product
  totalPrice: number
  bundlePrice: number  // 95 折
}

export function recommend(mood: MoodTag, luck: LuckTag, zodiac: Zodiac): QuizResult {
  const pickBest = (cat: string): Product => {
    const candidates = PRODUCTS.filter((p) => p.category === cat)
    return candidates
      .map((p) => ({ p, score: scoreProduct(p, mood, luck, zodiac) }))
      .sort((a, b) => b.score - a.score)[0].p
  }

  const herb = pickBest('herbs')
  const crystalSet = pickBest('crystal-sets')
  const energyWand = pickBest('energy-wands')
  const totalPrice = herb.price + crystalSet.price + energyWand.price
  const bundlePrice = Math.round(totalPrice * 0.95)

  return { herb, crystalSet, energyWand, totalPrice, bundlePrice }
}

// 推薦理由文字（依使用者輸入動態生成）
export function buildReason(
  product: Product,
  mood: MoodTag,
  luck: LuckTag,
  zodiac: Zodiac
): string {
  const moodLabel = MOOD_OPTIONS.find((m) => m.value === mood)?.label ?? ''
  const luckLabel = LUCK_OPTIONS.find((l) => l.value === luck)?.label ?? ''
  const zodiacEl = ZODIAC_ELEMENT[zodiac]
  const elementName = { fire: '火', wood: '木', earth: '土', wind: '風', water: '水' }[zodiacEl]

  if (product.mood_tags?.includes(mood) && product.luck_tags?.includes(luck)) {
    return `針對你「${moodLabel}」與「${luckLabel}」的雙重狀態，${product.subtitle ?? product.name}是最契合的選擇。`
  }
  if (product.mood_tags?.includes(mood)) {
    return `${product.subtitle ?? product.name}能溫和地承接你「${moodLabel}」的當下。`
  }
  if (product.luck_tags?.includes(luck)) {
    return `針對「${luckLabel}」的需求，${product.subtitle ?? product.name}能為你補上能量缺口。`
  }
  return `你的${elementName}屬性與${product.name}的元素相容，能為日常注入和諧。`
}
