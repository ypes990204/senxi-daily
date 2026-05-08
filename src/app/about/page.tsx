import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] bg-brown flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=1400"
          alt="關於森息日常"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 px-8 max-w-xl">
          <p className="text-sand text-xs tracking-[0.4em] mb-4">ABOUT US</p>
          <h1 className="font-serif text-cream text-4xl leading-snug">關於<br />森息日常</h1>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-xs tracking-[0.4em] text-tan mb-6">OUR STORY</p>
        <h2 className="font-serif text-3xl text-brown mb-8">從一束鼠尾草開始的日常</h2>
        <div className="text-sm text-brown-mid leading-loose space-y-5">
          <p>
            森息日常的起源，是創辦人在一次靜坐練習中第一次點燃白鼠尾草的體驗。
            那縷煙霧、那股氣息，讓她從繁雜的念頭中被拉回當下——
            那一刻，她明白了什麼叫做「回到自己」。
          </p>
          <p>
            帶著這份感動，她開始尋找最純淨、最天然的原料：
            來自加州的白鼠尾草、秘魯深山的聖木、地球億萬年孕育的水晶。
            每一件商品，都是一份邀請——邀請你在忙碌中停下來，為自己創造一個儀式。
          </p>
          <p>
            「森息」，是森林的呼吸，也是你在日常中的靜止。
            我們相信，儀式不需要複雜，只需要一個刻意的當下。
          </p>
        </div>
      </section>

      {/* 理念 */}
      <section className="bg-sand py-20">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: '純天然原料', desc: '每一件商品都從天然原料出發，無添加人工香精。香草真實的氣息，才是最好的淨化。' },
            { title: '道德採購', desc: '我們與重視永續的供應商合作，確保每一根聖木、每一束鼠尾草都來自負責任的採集。' },
            { title: '儀式日常化', desc: '儀式不是遙遠的靈性修行，而是每天早晨或睡前，給自己五分鐘的靜心時刻。' },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-serif text-xl text-brown mb-3">{item.title}</h3>
              <p className="text-sm text-brown-mid leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-4">
        <h2 className="font-serif text-2xl text-brown mb-4">準備好開始你的儀式了嗎？</h2>
        <p className="text-sm text-tan mb-8">探索我們精選的天然香草與水晶系列</p>
        <Link href="/products" className="btn-primary inline-block">
          瀏覽全部商品
        </Link>
      </section>
    </>
  )
}
