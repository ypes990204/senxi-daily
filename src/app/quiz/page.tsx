'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store'
import {
  MOOD_OPTIONS, LUCK_OPTIONS, ZODIAC_OPTIONS,
  recommend, buildReason, type QuizResult,
} from '@/lib/energy-quiz'
import type { MoodTag, LuckTag, Zodiac, Product } from '@/types'

type Stage = 'intro' | 'mood' | 'luck' | 'zodiac' | 'result'

const elementColor: Record<string, string> = {
  fire:  'bg-tan/30 text-brown',
  earth: 'bg-sage/20 text-brown',
  wind:  'bg-sage-light/40 text-brown',
  water: 'bg-sand text-brown',
}

export default function QuizPage() {
  const [stage, setStage] = useState<Stage>('intro')
  const [mood, setMood] = useState<MoodTag | null>(null)
  const [luck, setLuck] = useState<LuckTag | null>(null)
  const [zodiac, setZodiac] = useState<Zodiac | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const addItem = useCartStore((s) => s.addItem)
  const toggleCart = useCartStore((s) => s.toggleCart)

  const progressPct =
    stage === 'mood' ? 33 : stage === 'luck' ? 66 : stage === 'zodiac' ? 100 : 0

  const onPickMood = (m: MoodTag) => { setMood(m); setStage('luck') }
  const onPickLuck = (l: LuckTag) => { setLuck(l); setStage('zodiac') }
  const onPickZodiac = (z: Zodiac) => {
    setZodiac(z)
    if (mood && luck) setResult(recommend(mood, luck, z))
    setStage('result')
  }
  const reset = () => {
    setMood(null); setLuck(null); setZodiac(null); setResult(null); setStage('intro')
  }

  const addBundle = () => {
    if (!result) return
    addItem(result.herb)
    addItem(result.crystalSet)
    addItem(result.energyWand)
    toggleCart()
  }

  return (
    <div className="bg-cream min-h-screen">
      {/* Hero / Intro */}
      {stage === 'intro' && (
        <section className="max-w-3xl mx-auto px-4 py-24 text-center">
          <p className="text-xs tracking-[0.4em] text-tan mb-4">ENERGY QUIZ</p>
          <h1 className="font-serif text-4xl md:text-5xl text-brown leading-tight mb-6">
            為你量身推薦<br />3 件搭配商品
          </h1>
          <p className="text-brown-mid leading-loose mb-8 max-w-xl mx-auto">
            回答 3 個關於心情、運氣與星座的問題，<br />
            讓能量為你從 26 件商品中挑選最契合的搭配組合。<br />
            <span className="text-sm text-tan">約 60 秒完成</span>
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-md mx-auto mb-10">
            {[
              { icon: '🌿', label: '心情', sub: '你最近的狀態' },
              { icon: '🌙', label: '運氣', sub: '近期關注議題' },
              { icon: '✨', label: '星座', sub: '你的元素能量' },
            ].map((it) => (
              <div key={it.label} className="bg-sand rounded-md py-6 px-3">
                <div className="text-3xl mb-2">{it.icon}</div>
                <div className="font-serif text-brown">{it.label}</div>
                <div className="text-xs text-brown-mid mt-1">{it.sub}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setStage('mood')} className="btn-primary">
            開始能量測試 →
          </button>
        </section>
      )}

      {/* Quiz Steps */}
      {stage !== 'intro' && stage !== 'result' && (
        <section className="max-w-3xl mx-auto px-4 py-16">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex justify-between text-xs text-brown-mid mb-2">
              <span>
                {stage === 'mood' ? '01 / 03' : stage === 'luck' ? '02 / 03' : '03 / 03'}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full bg-tan transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Step 1: Mood */}
          {stage === 'mood' && (
            <>
              <h2 className="font-serif text-3xl text-brown text-center mb-3">
                你最近的心情如何？
              </h2>
              <p className="text-center text-brown-mid mb-10 text-sm">
                選擇最貼近你現在狀態的一項
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {MOOD_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => onPickMood(m.value)}
                    className="bg-cream border border-sand hover:border-tan hover:shadow-md rounded-lg p-6 text-left transition-all"
                  >
                    <div className="text-3xl mb-3">{m.emoji}</div>
                    <div className="font-serif text-brown mb-1">{m.label}</div>
                    <div className="text-xs text-brown-mid">{m.sub}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Luck */}
          {stage === 'luck' && (
            <>
              <h2 className="font-serif text-3xl text-brown text-center mb-3">
                你目前的運氣狀態？
              </h2>
              <p className="text-center text-brown-mid mb-10 text-sm">
                選擇最近你最在意的議題
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                {LUCK_OPTIONS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => onPickLuck(l.value)}
                    className="bg-cream border border-sand hover:border-tan hover:shadow-md rounded-lg px-6 py-5 text-left transition-all flex items-center gap-4"
                  >
                    <span className="text-2xl">{l.emoji}</span>
                    <span className="font-serif text-brown">{l.label}</span>
                  </button>
                ))}
              </div>
              <div className="text-center mt-8">
                <button onClick={() => setStage('mood')} className="text-sm text-tan hover:text-brown">
                  ← 上一步
                </button>
              </div>
            </>
          )}

          {/* Step 3: Zodiac */}
          {stage === 'zodiac' && (
            <>
              <h2 className="font-serif text-3xl text-brown text-center mb-3">
                你的星座？
              </h2>
              <p className="text-center text-brown-mid mb-10 text-sm">
                為了配對最契合的元素能量
              </p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {ZODIAC_OPTIONS.map((z) => (
                  <button
                    key={z.value}
                    onClick={() => onPickZodiac(z.value)}
                    className="bg-cream border border-sand hover:border-tan hover:shadow-md rounded-lg p-4 transition-all"
                  >
                    <div className="text-2xl mb-1">{z.symbol}</div>
                    <div className="font-serif text-sm text-brown">{z.label}</div>
                    <div className={`text-[10px] mt-2 inline-block px-2 py-0.5 rounded-full ${elementColor[z.element]}`}>
                      {{ fire:'火', wood:'木', earth:'土', wind:'風', water:'水' }[z.element]}
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-center mt-8">
                <button onClick={() => setStage('luck')} className="text-sm text-tan hover:text-brown">
                  ← 上一步
                </button>
              </div>
            </>
          )}
        </section>
      )}

      {/* Result */}
      {stage === 'result' && result && mood && luck && zodiac && (
        <ResultView
          mood={mood}
          luck={luck}
          zodiac={zodiac}
          result={result}
          onRetake={reset}
          onAddBundle={addBundle}
          onAddSingle={(p: Product) => { addItem(p); toggleCart() }}
        />
      )}
    </div>
  )
}

// ===== Result View =====
function ResultView({
  mood, luck, zodiac, result, onRetake, onAddBundle, onAddSingle,
}: {
  mood: MoodTag
  luck: LuckTag
  zodiac: Zodiac
  result: QuizResult
  onRetake: () => void
  onAddBundle: () => void
  onAddSingle: (p: Product) => void
}) {
  const moodLabel = MOOD_OPTIONS.find((m) => m.value === mood)?.label
  const luckLabel = LUCK_OPTIONS.find((l) => l.value === luck)?.label
  const zodiacLabel = ZODIAC_OPTIONS.find((z) => z.value === zodiac)?.label

  const cards: Array<{ p: Product; tag: string }> = [
    { p: result.herb,       tag: '草本系列' },
    { p: result.crystalSet, tag: '水晶套裝' },
    { p: result.energyWand, tag: '能量草杖' },
  ]

  return (
    <>
      {/* Result hero */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-xs tracking-[0.4em] text-tan mb-4">YOUR ENERGY READING</p>
        <h1 className="font-serif text-4xl md:text-5xl text-brown leading-tight mb-6">
          你的專屬能量推薦
        </h1>
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          <span className="bg-sand px-4 py-1.5 rounded-full text-sm text-brown">{moodLabel}</span>
          <span className="bg-sand px-4 py-1.5 rounded-full text-sm text-brown">{luckLabel}</span>
          <span className="bg-sand px-4 py-1.5 rounded-full text-sm text-brown">{zodiacLabel}</span>
        </div>
        <p className="text-brown-mid max-w-xl mx-auto">
          以你的當下狀態，從 26 件商品挑出最契合的 3 件，分別來自我們的三大系列。
        </p>
      </section>

      {/* 3 Recommended cards */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ p, tag }) => (
            <div key={p.id} className="bg-white border border-sand rounded-lg overflow-hidden flex flex-col">
              <div className="relative aspect-square bg-sand">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                <span className="absolute top-3 left-3 bg-tan text-cream text-xs px-2 py-1 rounded">
                  為你推薦・{tag}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs text-tan tracking-widest mb-1">{p.subtitle}</p>
                <h3 className="font-serif text-brown leading-snug mb-2">{p.name}</h3>
                <p className="text-sm text-brown-mid leading-relaxed mb-4 flex-1">
                  {buildReason(p, mood, luck, zodiac)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-lg text-brown">NT${p.price.toLocaleString()}</span>
                  <button
                    onClick={() => onAddSingle(p)}
                    className="text-sm bg-brown text-cream px-3 py-1.5 rounded hover:bg-brown-mid transition-colors"
                  >
                    加入購物車
                  </button>
                </div>
                <Link
                  href={`/products/${p.slug}`}
                  className="mt-3 text-xs text-tan hover:text-brown text-center"
                >
                  看商品詳情 →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bundle pricing */}
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <div className="bg-sand rounded-lg p-8 text-center">
          <p className="text-xs tracking-widest text-tan mb-2">BUNDLE OFFER</p>
          <p className="text-brown-mid mb-1">三件原價 NT${result.totalPrice.toLocaleString()}</p>
          <p className="font-serif text-3xl text-brown mb-4">
            一次帶走享 95 折・<span className="text-tan">NT${result.bundlePrice.toLocaleString()}</span>
          </p>
          <p className="text-xs text-brown-mid mb-6">
            （優惠折扣將於結帳時自動套用）
          </p>
          <button onClick={onAddBundle} className="btn-primary">
            一次加入 3 件商品
          </button>
        </div>
      </section>

      {/* Save your result CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-16 text-center">
        <h3 className="font-serif text-xl text-brown mb-3">想記住這份推薦？</h3>
        <p className="text-sm text-brown-mid mb-6">
          登入會員可保存能量測試紀錄，並接收每月新月時的個人化推薦。
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/login" className="btn-primary">登入帳號</Link>
          <Link href="/auth/register" className="btn-outline">註冊新帳號</Link>
        </div>
      </section>

      {/* Retake */}
      <section className="text-center pb-20">
        <button onClick={onRetake} className="text-sm text-tan hover:text-brown underline underline-offset-4">
          想換個心情試試？重新測驗
        </button>
      </section>
    </>
  )
}
