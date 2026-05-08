'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ShoppingBag, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { Product } from '@/types'
import { getBySlug } from '@/lib/products'

const CATEGORY_LABEL: Record<string, string> = {
  herbs: '草本系列',
  'crystal-sets': '水晶套裝',
  'energy-wands': '能量草杖',
  accessory: '配件',
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [activeImg, setActiveImg] = useState(0)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    setProduct(getBySlug(slug) ?? null)
  }, [slug])

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-tan mb-4">找不到此商品</p>
        <Link href="/products" className="text-sm text-brown underline">回到商品列表</Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* 圖片區 */}
        <div>
          <div className="relative aspect-square bg-sand">
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-16 border-2 transition-colors ${i === activeImg ? 'border-brown' : 'border-transparent'}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 資訊區 */}
        <div className="flex flex-col">
          <p className="text-xs text-tan tracking-widest mb-3">
            {CATEGORY_LABEL[product.category] ?? product.category}
          </p>
          <h1 className="font-serif text-2xl md:text-3xl text-brown">{product.name}</h1>
          {product.subtitle && (
            <p className="text-sm text-tan mt-2 tracking-wide">{product.subtitle}</p>
          )}
          <p className="text-xl text-brown-mid mt-4">NT$ {product.price.toLocaleString()}</p>

          <div className="border-t border-sand my-6" />

          <p className="text-sm text-brown-mid leading-loose whitespace-pre-line">
            {product.description}
          </p>

          {product.ingredients && product.ingredients.length > 0 && (
            <div className="mt-5">
              <p className="text-xs text-tan tracking-widest mb-2">內含材料</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span key={ing} className="text-xs bg-sand text-brown-mid px-3 py-1 rounded-full">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-sand my-6" />

          {/* 數量 */}
          <div className="flex items-center gap-6 mb-6">
            <span className="text-sm text-brown-mid">數量</span>
            <div className="flex items-center border border-sand">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-brown-mid hover:bg-sand transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="px-4 text-sm text-brown">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-2 text-brown-mid hover:bg-sand transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-xs text-tan">庫存 {product.stock} 件</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <ShoppingBag size={16} />
            {added ? '已加入購物車 ✓' : '加入購物車'}
          </button>

          {product.stock === 0 && (
            <p className="text-xs text-tan mt-3 text-center">此商品目前無庫存</p>
          )}

          <div className="mt-8 p-4 bg-sand text-xs text-brown-mid leading-relaxed space-y-1">
            <p>· 滿 NT$1,500 免運費（台灣本島）</p>
            <p>· 訂單於 1-3 個工作天內出貨</p>
            <p>· 7 天鑑賞期（天然礦石、乾燥植物不適用）</p>
          </div>
        </div>
      </div>
    </div>
  )
}
