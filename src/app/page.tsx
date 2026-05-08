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
    en: 'Single Herbs',
    count: '8 款',
    desc: '鼠尾草・聖木・薰衣草・尤加利・迷迭香・雪松・北美聖草・龍血草',
    href: '/products?category=herbs',
    img: 'https://images.unsplash.com/photo-1599623560574-39d485900c95?w=900&auto=format&fit=crop',
  },
  {
    label: '水晶套裝',
    en: 'Crystal Sets',
    count: '9 款',
    desc: '紫晶・粉晶・黃晶・東陵玉・紅碧玉・藍紋石⋯每組附聖木與鼠尾草',
    href: '/products?category=crystal-sets',
    img: 'https://images.unsplash.com/photo-1567632630891-38b39c12e1a0?w=900&auto=format&fit=crop',
  },
  {
    label: '能量草杖',
    en: 'Energy Wands',
    count: '9 款',
    desc: '薰衣草為基底的複方手作草杖，依情境與心境分配',
    href: '/products?category=energy-wands',
    img: 'https://images.unsplash.com/photo-1502209524164-acea936639a2?w=900&auto=format&fit=crop',
  },
]

const CRAFT_STEPS = [
  { num: '01', title: '採集', desc: '春末夏初手摘新鮮香草，挑選未受蟲害的最佳枝段。' },
  { num: '02', title: '風乾', desc: '陰涼通風處風乾 14 天，保留植物天然精油不流失。' },
  { num: '03', title: '編紮', desc: '依配方比例手工綁束，每根草杖都帶有師傅的指紋與意念。' },
]

const SCENARIOS = [
  {
    title: '居家淨化',
    desc: '搬家、爭吵後、感覺氣場混亂時，從玄關開始燻起，每個房間停留 30 秒。',
    img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop',
  },
  {
    title: '冥想練習',
    desc: '坐定後點燃鼠尾草或聖木，環繞自己畫一個圓，再開始呼吸練習。',
    img: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&auto=format&fit=crop',
  },
  {
    title: '新空間入住',
    desc: '搭配白石膏草杖徹底開光，從最遠角落往大門方向燻，迎請新能量。',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
  },
]

const REVIEWS = [
  { name: '怡君', product: '紫晶簇套組', rating: 5, text: '搬家後第一週每天燒，整間屋子的氣場真的不一樣。' },
  { name: 'Cynthia', product: '薰衣草+雪松 草杖', rating: 5, text: '失眠的夜晚點一根，搭配薰衣草精油，半小時內就有睡意。' },
  { name: '小蘋', product: '粉晶套組', rating: 5, text: '失戀後買的，每天看著粉晶提醒自己先愛自己，現在好多了。' },
  { name: '芳芳', product: '黃水晶套組', rating: 5, text: '創業前淨化辦公室用的，前三個月真的接到大訂單，玄學歸玄學，心情好就是事實。' },
  { name: 'Allen', product: '迷迭香', rating: 5, text: '工作前點一支，香氣讓頭腦清晰很多，比咖啡有用。' },
  { name: '雅婷', product: '薰衣草+勿忘我 草杖', rating: 5, text: '本店招牌不是叫假的，包裝美爆，香氣甜美層次很多。' },
]

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <>
      {/* Hero — warm flat-lay */}
      <section className="relative bg-cream-soft">
        <div className="grid md:grid-cols-2 min-h-[600px]">
          {/* Left: text */}
          <div className="flex items-center px-8 md:px-16 py-20">
            <div className="max-w-md">
              <p className="text-xs tracking-[0.4em] text-terracotta mb-5">FOREST BREATH DAILY</p>
              <h1 className="font-serif text-5xl md:text-6xl text-earth leading-[1.15] mb-6">
                親手栽培的能量<br />
                <span className="text-moss">每日的森息</span>
              </h1>
              <p className="text-stone leading-loose mb-9">
                從鼠尾草到能量草杖，26 件精選草本與水晶<br />
                為你打造日常的儀式與淨化時刻。<br />
                小批量手作，每一束都有溫度。
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/products" className="btn-primary">
                  選購全系列
                </Link>
                <Link href="/quiz" className="btn-outline">
                  ✨ 先測你的能量
                </Link>
              </div>
            </div>
          </div>
          {/* Right: image */}
          <div className="relative min-h-[400px] md:min-h-[600px]">
            <Image
              src="https://images.unsplash.com/photo-1502209524164-acea936639a2?w=1400&auto=format&fit=crop"
              alt="森息日常 hero"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 能量測試入口 — terracotta highlight */}
      <section className="bg-terracotta/8 border-y border-sand-beige">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_auto] items-center gap-8">
          <div>
            <p className="text-xs tracking-[0.4em] text-terracotta mb-3">ENERGY QUIZ ✨</p>
            <h2 className="font-serif text-3xl md:text-4xl text-earth leading-tight mb-3">
              不知道從哪開始？讓能量為你選擇
            </h2>
            <p className="text-stone leading-relaxed max-w-xl">
              回答關於心情、運氣與星座的 3 個問題，
              60 秒內，從 26 件商品中為你推薦最契合的搭配組合，
              一次帶走享 95 折。
            </p>
            <p className="text-xs text-stone mt-3">已有 3,200+ 位朋友完成測試</p>
          </div>
          <Link href="/quiz" className="btn-accent whitespace-nowrap text-base px-8 py-4">
            開始能量測試 →
          </Link>
        </div>
      </section>

      {/* 三大商品系列 */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] text-terracotta mb-3">THREE SERIES</p>
          <h2 className="section-title mb-4">三大商品系列</h2>
          <p className="text-stone leading-relaxed">
            從單方草本到複方草杖，照顧你日常每一刻能量需求
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERIES.map((s) => (
            <Link key={s.href} href={s.href} className="group bg-cream-soft rounded-lg overflow-hidden hover:shadow-soft-lg transition-shadow duration-300">
              <div className="relative aspect-[4/3] bg-sand-beige overflow-hidden">
                <Image src={s.img} alt={s.label} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-7">
                <p className="text-xs tracking-widest text-terracotta mb-2">{s.en}　·　{s.count}</p>
                <h3 className="font-serif text-2xl text-earth mb-3">{s.label}</h3>
                <p className="text-sm text-stone leading-relaxed mb-5">{s.desc}</p>
                <span className="text-sm text-moss group-hover:text-moss-dark font-medium tracking-wide">瀏覽系列 →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 本月精選 */}
      <section className="bg-cream-soft py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-baseline justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.4em] text-terracotta mb-2">THIS MONTH'S PICKS</p>
              <h2 className="section-title">本月精選商品</h2>
            </div>
            <Link href="/products" className="text-sm text-moss hover:text-moss-dark font-medium transition-colors">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 特製能量草杖 — featured banner */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] bg-sand-beige rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1518709779341-56cf4535e94b?w=1200&auto=format&fit=crop"
              alt="特製能量草杖"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="inline-block bg-terracotta text-white text-xs px-3 py-1 rounded mb-4">本店招牌</span>
            <p className="text-xs tracking-[0.4em] text-terracotta mb-3">SIGNATURE WAND</p>
            <h2 className="font-serif text-4xl text-earth leading-tight mb-5">
              薰衣草複方<br />手作能量草杖
            </h2>
            <p className="text-stone leading-loose mb-6">
              以薰衣草為基底，搭配雪松、玫瑰、勿忘我、水晶柱⋯共 9 種配方。<br />
              依你今天的情境與心境，挑一款最契合的能量陪伴。
            </p>
            <div className="bg-sand-beige/40 rounded p-5 mb-7">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-stone text-sm line-through">個別購買 NT$1,520</span>
                <span className="text-xs bg-terracotta/20 text-terracotta px-2 py-0.5 rounded">省 NT$240</span>
              </div>
              <div>
                <span className="text-sm text-stone">草杖組合價 </span>
                <span className="font-serif text-3xl text-earth">NT$1,280</span>
              </div>
            </div>
            <Link href="/products?category=energy-wands" className="btn-primary">
              看 9 款配方
            </Link>
          </div>
        </div>
      </section>

      {/* 手作工藝故事 */}
      <section className="bg-sand-beige/30 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] text-terracotta mb-3">CRAFTING STORY</p>
            <h2 className="section-title mb-3">手作工藝故事</h2>
            <p className="text-stone">每一束草杖都經過三個階段，慢慢來</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {CRAFT_STEPS.map((s) => (
              <div key={s.num} className="text-center">
                <div className="font-serif text-5xl text-terracotta mb-4">{s.num}</div>
                <h3 className="font-serif text-2xl text-earth mb-3">{s.title}</h3>
                <p className="text-sm text-stone leading-relaxed">{s.desc}</p>
              </div>
            ))}
            <p className="md:col-span-3 text-center text-sm text-stone italic mt-4">
              — 森息工作室・手作於台灣
            </p>
          </div>
        </div>
      </section>

      {/* 使用情境 */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.4em] text-terracotta mb-3">USE CASES</p>
          <h2 className="section-title">三種使用情境</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SCENARIOS.map((s) => (
            <div key={s.title} className="bg-cream-soft rounded-lg overflow-hidden">
              <div className="relative aspect-[4/3] bg-sand-beige">
                <Image src={s.img} alt={s.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-earth mb-3">{s.title}</h3>
                <p className="text-sm text-stone leading-relaxed mb-4">{s.desc}</p>
                <Link href="/quiz" className="text-sm text-moss hover:text-moss-dark font-medium">
                  看搭配建議 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 顧客評價 */}
      <section className="bg-cream-soft py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] text-terracotta mb-3">REVIEWS</p>
            <h2 className="section-title">顧客的話</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-cream rounded-lg p-6">
                <div className="text-terracotta mb-3">{'★'.repeat(r.rating)}</div>
                <p className="text-sm text-earth leading-loose mb-4">「{r.text}」</p>
                <div className="text-xs text-stone">
                  <span className="font-medium">{r.name}</span>　·
                  <span>購買 {r.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 訂閱 */}
      <section className="bg-sand-beige/40 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-terracotta mb-3">FOREST DIARY</p>
          <h2 className="font-serif text-3xl text-earth mb-3">加入森息日記</h2>
          <p className="text-stone mb-7">每月新月當天寄一封信，附上當月最契合的能量推薦與 9 折優惠碼</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="你的 Email"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-accent whitespace-nowrap">訂閱</button>
          </form>
          <p className="text-xs text-stone mt-3">隨時可取消，我們不會分享你的資料</p>
        </div>
      </section>

      {/* 品牌理念 */}
      <section className="bg-cream-soft py-20 border-t border-sand-beige">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-terracotta mb-6">OUR PHILOSOPHY</p>
          <h2 className="font-serif text-3xl text-earth mb-8 leading-relaxed">
            森息，是森林的呼吸<br />也是你在日常中的靜止
          </h2>
          <p className="text-stone leading-loose max-w-xl mx-auto mb-10">
            我們相信，每一個人都需要屬於自己的儀式時刻。
            透過天然香草的煙霧，讓空間與內心同步被淨化；
            透過水晶的能量，讓當下變得更加踏實與清明。
          </p>
          <Link href="/about" className="btn-outline">
            了解更多
          </Link>
        </div>
      </section>
    </>
  )
}
