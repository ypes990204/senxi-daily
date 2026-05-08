export type ProductCategory = 'herbs' | 'crystal-sets' | 'energy-wands' | 'accessory'
export type Element = 'fire' | 'wood' | 'earth' | 'wind' | 'water'
export type MoodTag = 'anxious' | 'low' | 'tired' | 'angry' | 'calm' | 'joyful' | 'lost'
export type LuckTag = 'unlucky' | 'romance' | 'career' | 'health' | 'newspace' | 'newplan'

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  created_at: string
  // 能量標籤（推薦演算法用）
  subtitle?: string
  ingredients?: string[]
  mood_tags?: MoodTag[]
  luck_tags?: LuckTag[]
  elements?: Element[]
}

export type Zodiac =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  quantity: number
  price: number
}

export interface Profile {
  id: string
  name: string
  phone: string
  address: string
}
