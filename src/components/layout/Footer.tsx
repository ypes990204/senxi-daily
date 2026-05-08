import Link from 'next/link'
import { Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brown text-cream mt-24">
      <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <p className="font-serif text-xl tracking-widest mb-4">森息日常</p>
          <p className="text-sm text-tan leading-relaxed">
            天然香草淨化儀式用品。<br />
            讓每一天從儀式開始，<br />
            回到內心的寧靜。
          </p>
        </div>

        <div>
          <p className="text-sm tracking-widest mb-4 text-sand">商品分類</p>
          <ul className="space-y-2 text-sm text-tan">
            {[
              ['鼠尾草束', '/products?category=smudge'],
              ['聖木 Palo Santo', '/products?category=palo-santo'],
              ['水晶原石', '/products?category=crystal'],
              ['配件', '/products?category=accessory'],
              ['禮盒組合', '/products?category=gift'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-cream transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm tracking-widest mb-4 text-sand">服務資訊</p>
          <ul className="space-y-2 text-sm text-tan">
            {[
              ['關於我們', '/about'],
              ['常見問題', '/faq'],
              ['隱私權政策', '/privacy'],
              ['退換貨政策', '/returns'],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-cream transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-tan hover:text-cream transition-colors text-sm"
          >
            <Instagram size={16} />
            @senxidaily
          </a>
        </div>
      </div>

      <div className="border-t border-brown-mid text-center py-6 text-xs text-tan">
        © 2025 森息日常 Sen Xi Daily. All rights reserved.
      </div>
    </footer>
  )
}
