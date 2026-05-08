'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, User, Search } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'

const navLinks: Array<{ href: string; label: string; highlight?: boolean }> = [
  { href: '/products', label: '全部商品' },
  { href: '/products?category=herbs', label: '草本系列' },
  { href: '/products?category=crystal-sets', label: '水晶套裝' },
  { href: '/products?category=energy-wands', label: '能量草杖' },
  { href: '/quiz', label: '能量測試', highlight: true },
  { href: '/about', label: '品牌故事' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toggleCart, count } = useCartStore()
  const cartCount = count()

  return (
    <>
      {/* Announcement bar (不 sticky) */}
      <div className="bg-terracotta text-white text-xs text-center py-2 px-4 tracking-wide">
        🌿 首購會員 9 折　·　滿 NT$1,500 免運　·　加入 LINE@ 領能量測試優惠碼
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-sand-beige">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-serif text-2xl text-earth tracking-wider">
            森息日常
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  link.highlight
                    ? 'text-sm text-terracotta hover:text-terracotta-dark font-semibold tracking-wide flex items-center gap-1'
                    : 'text-sm text-earth/80 hover:text-earth transition-colors tracking-wide'
                }
              >
                {link.highlight && <span aria-hidden>✨</span>}
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:block text-earth/70 hover:text-earth transition-colors" aria-label="搜尋">
              <Search size={20} />
            </button>
            <Link href="/account" className="text-earth/70 hover:text-earth transition-colors" aria-label="會員">
              <User size={20} />
            </Link>
            <button
              onClick={toggleCart}
              className="relative text-earth/70 hover:text-earth transition-colors"
              aria-label="購物車"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-earth"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="選單"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden bg-cream border-t border-sand-beige">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-6 py-3 text-sm transition-colors ${
                  link.highlight
                    ? 'text-terracotta font-semibold bg-terracotta/5'
                    : 'text-earth/80 hover:bg-sand-beige/30'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.highlight && '✨ '}
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  )
}
