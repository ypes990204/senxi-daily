'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="group">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-sand overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-tan text-xs">
              無圖片
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-cream/70 flex items-center justify-center">
              <span className="text-xs text-brown-mid tracking-widest">已售完</span>
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-sm text-brown font-medium leading-snug">{product.name}</p>
          <p className="text-sm text-tan mt-1">NT$ {product.price.toLocaleString()}</p>
        </div>
      </Link>
      <button
        onClick={() => product.stock > 0 && addItem(product)}
        disabled={product.stock === 0}
        className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 border border-brown text-brown text-xs tracking-widest hover:bg-brown hover:text-cream transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={14} />
        加入購物車
      </button>
    </div>
  )
}
