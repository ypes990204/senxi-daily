'use client'

import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store'

const navLinks: Array<{ href: string; label: string; highlight?: boolean }> = [
  { href: '/products', label: '全部商品' },
  { href: '/products?category=herbs', label: '草本系列' },
  { href: '/products?category=crystal-sets', label: '水晶套裝' },
  { href: '/products?category=energy-wands', label: '能量草杖' },
  { href: '/quiz', label: '能量測試', highlight: true },
  { href: '/about', label: '關於我們' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toggleCart, count } = useCartStore()
  const cartCount = count()

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-sand">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl text-brown tracking-widest">
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
                  ? 'text-sm text-tan hover:text-brown font-semibold tracking-wide flex items-center gap-1'
                  : 'text-sm text-brown-mid hover:text-brown transition-colors tracking-wide'
              }
            >
              {link.highlight && <span aria-hidden>✨</span>}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-brown-mid hover:text-brown transition-colors">
            <User size={20} />
          </Link>
          <button
            onClick={toggleCart}
            className="relative text-brown-mid hover:text-brown transition-colors"
            aria-label="購物車"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brown text-cream text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-brown"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="選單"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-sand">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-6 py-3 text-sm text-brown-mid hover:bg-sand transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
