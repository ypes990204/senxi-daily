import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { getFeatured } from '@/lib/products'

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(4)
    if (data && data.length > 0) return data
  } catch {
    // fallthrough
  }
  return getFeatured(4)
}

const SERIES = [
  {
    label: '草本系列',
    sub: 'Single Herbs · 8 款',
    desc: '鼠尾草・聖木・薰衣草・尤加利・迷迭香・雪松⋯',
    href: '/products?category=herbs',
    img: 'https://images.unsplash.com/photo-1599623560574-39d485900c95?w=600',
  },
  {
    label: '水晶套裝',
    sub: 'Crystal Sets · 9 款',
    desc: '紫晶簇・粉晶・黃晶・東陵玉・紅碧玉⋯',
    href: '/products?category=crystal-sets',
    img: 'https://images.unsplash.com/photo-1567632630891-38b39c12e1a0?w=600',
  },
  {
    label: '能量草杖',
    sub: 'Energy Wands · 9 款',
    desc: '薰衣草為基底的複方手作草杖',
    href: '/products?category=energy-wands',
    img: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?w=600',
  },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] flex items-end bg-brown">
        <Image
          src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1400"
          alt="森息日常 hero"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="relative z-10 px-8 pb-20 max-w-xl">
          <p className="text-sand text-xs tracking-[0.3em] mb-4">SACRED HERBS · CRYSTALS · RITUAL</p>
          <h1 className="font-serif text-cream text-4xl md:text-5xl leading-tight mb-6">
            在煙霧裡<br />找回寧靜
          </h1>
          <p className="text-sand text-sm leading-relaxed mb-8">
            每一束鼠尾草，每一根聖木，<br />
            都是一次回到自己的機會。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary inline-block">
              探索全系列
            </Link>
            <Link
              href="/quiz"
              className="inline-block border border-cream text-cream px-6 py-3 text-sm tracking-widest hover:bg-cream hover:text-brown transition-colors"
            >
              ✨ 先測你的能量
            </Link>
          </div>
        </div>
      </section>

      {/* 能量測試入口（醒目區塊）*/}
      <section className="bg-tan/20 border-y border-sand">
        <div className="max-w-5xl mx-auto px-4 py-14 grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <p className="text-xs tracking-[0.4em] text-tan mb-3">ENERGY QUIZ</p>
            <h2 className="font-serif text-2xl md:text-3xl text-brown leading-tight mb-3">
              不知道從哪開始？<br className="md:hidden" />讓能量為你選擇
            </h2>
            <p className="text-sm text-brown-mid leading-relaxed max-w-xl">
              回答關於心情、運氣、星座的 3 個問題，60 秒內，從 26 件商品中為你推薦最契合的搭配組合。
            </p>
          </div>
          <Link
            href="/quiz"
            className="btn-primary whitespace-nowrap"
          >
            開始能量測試 →
          </Link>
        </div>
      </section>

      {/* 三大系列 */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] text-tan mb-3">THREE SERIES</p>
          <h2 className="section-title">三大商品系列</h2>
          <p className="text-sm text-brown-mid mt-3">26 件精選商品，從單方草本到複方草杖，照顧你日常每一刻能量需求</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERIES.map((s) => (
            <Link key={s.href} href={s.href} className="group bg-white border border-sand rounded-md overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-[4/3] bg-sand">
                <Image src={s.img} alt={s.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <p className="text-xs tracking-widest text-tan mb-1">{s.sub}</p>
                <h3 className="font-serif text-xl text-brown mb-2">{s.label}</h3>
                <p className="text-sm text-brown-mid leading-relaxed mb-3">{s.desc}</p>
                <span className="text-sm text-brown group-hover:text-tan transition-colors">瀏覽系列 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 精選商品 */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="section-title">本月精選</h2>
          <Link href="/products" className="text-sm text-tan hover:text-brown transition-colors">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 品牌理念 */}
      <section className="bg-sand py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.4em] text-tan mb-6">OUR PHILOSOPHY</p>
          <h2 className="font-serif text-3xl text-brown mb-8 leading-relaxed">
            森息，是森林的呼吸<br />也是你在日常中的靜止
          </h2>
          <p className="text-sm text-brown-mid leading-loose max-w-xl mx-auto">
            我們相信，每一個人都需要屬於自己的儀式時刻。
            透過天然香草的煙霧，讓空間與內心同步被淨化；
            透過水晶的能量，讓當下變得更加踏實與清明。
          </p>
          <Link href="/about" className="mt-10 inline-block btn-outline">
            了解更多
          </Link>
        </div>
      </section>
    </>
  )
}
