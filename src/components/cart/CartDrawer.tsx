'use client'

import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import Image from 'next/image'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total } = useCartStore()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-cream z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sand">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brown" />
            <span className="font-serif text-brown text-lg">購物車</span>
          </div>
          <button onClick={toggleCart} className="text-brown-mid hover:text-brown transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-tan">
              <ShoppingBag size={48} className="mb-4 opacity-30" />
              <p className="text-sm">購物車是空的</p>
              <button
                onClick={toggleCart}
                className="mt-6 text-sm text-brown underline underline-offset-4"
              >
                繼續逛逛
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-sand flex-shrink-0">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brown font-medium truncate">{product.name}</p>
                    <p className="text-sm text-tan mt-0.5">
                      NT$ {product.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="text-brown-mid hover:text-brown transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm text-brown w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="text-brown-mid hover:text-brown transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-tan hover:text-brown transition-colors self-start mt-1"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-sand space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-brown-mid">小計</span>
              <span className="text-brown font-medium">
                NT$ {total().toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-tan">運費及折扣於結帳時計算</p>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full btn-primary text-center"
            >
              前往結帳
            </Link>
            <button
              onClick={toggleCart}
              className="block w-full text-center text-sm text-brown-mid hover:text-brown transition-colors"
            >
              繼續購物
            </button>
          </div>
        )}
      </div>
    </>
  )
}
