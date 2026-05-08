'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store'
import Image from 'next/image'

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    city: '', district: '', address: '',
    note: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 串接金流（ECPay / NewebPay）
    alert('金流尚未串接，訂單功能開發中。')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center text-tan">
        <p>購物車是空的，無法結帳。</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="section-title mb-10">結帳</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-12">
        {/* 表單 */}
        <div className="md:col-span-3 space-y-6">
          <div>
            <p className="text-sm text-brown font-medium mb-4 tracking-wide">收件人資料</p>
            <div className="space-y-3">
              <input required name="name" placeholder="姓名" value={form.name} onChange={handleChange} className="input-field" />
              <input required name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="input-field" />
              <input required name="phone" placeholder="手機號碼" value={form.phone} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <p className="text-sm text-brown font-medium mb-4 tracking-wide">收件地址</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input required name="city" placeholder="縣市" value={form.city} onChange={handleChange} className="input-field" />
                <input required name="district" placeholder="鄉鎮市區" value={form.district} onChange={handleChange} className="input-field" />
              </div>
              <input required name="address" placeholder="詳細地址" value={form.address} onChange={handleChange} className="input-field" />
            </div>
          </div>

          <div>
            <p className="text-sm text-brown font-medium mb-4 tracking-wide">付款方式</p>
            <div className="p-4 border border-sand bg-sand/40">
              <p className="text-sm text-brown-mid">線上付款（信用卡 / ATM / 超商代碼）</p>
              <p className="text-xs text-tan mt-1">金流串接開發中，敬請期待</p>
            </div>
          </div>

          <div>
            <textarea
              name="note"
              placeholder="訂單備註（選填）"
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            確認下單
          </button>
        </div>

        {/* 訂單摘要 */}
        <div className="md:col-span-2">
          <p className="text-sm text-brown font-medium mb-4 tracking-wide">訂單摘要</p>
          <ul className="space-y-4 mb-6">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 bg-sand flex-shrink-0">
                  {product.images[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="text-brown leading-snug">{product.name}</p>
                  <p className="text-tan">× {quantity}</p>
                </div>
                <p className="text-sm text-brown">NT$ {(product.price * quantity).toLocaleString()}</p>
              </li>
            ))}
          </ul>

          <div className="border-t border-sand pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-brown-mid">
              <span>小計</span>
              <span>NT$ {total().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-brown-mid">
              <span>運費</span>
              <span>{total() >= 1500 ? '免運' : 'NT$ 100'}</span>
            </div>
            <div className="flex justify-between text-brown font-medium text-base pt-2 border-t border-sand">
              <span>總計</span>
              <span>NT$ {(total() + (total() >= 1500 ? 0 : 100)).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
