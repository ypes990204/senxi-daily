'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Order } from '@/types'
import { User, Package, LogOut } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  pending: '待付款',
  paid: '已付款',
  shipped: '已出貨',
  delivered: '已送達',
  cancelled: '已取消',
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setOrders(data ?? [])
      setLoading(false)
    }
    fetchData()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="text-center py-20 text-tan text-sm">載入中...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="section-title">會員中心</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-tan hover:text-brown transition-colors">
          <LogOut size={16} />
          登出
        </button>
      </div>

      {/* 會員資訊 */}
      <div className="flex items-center gap-4 p-6 bg-sand mb-10">
        <div className="w-12 h-12 rounded-full bg-brown flex items-center justify-center">
          <User size={20} className="text-cream" />
        </div>
        <div>
          <p className="font-medium text-brown">{user?.user_metadata?.name ?? '會員'}</p>
          <p className="text-sm text-tan">{user?.email}</p>
        </div>
      </div>

      {/* 訂單列表 */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Package size={18} className="text-brown" />
          <h2 className="text-base font-medium text-brown">我的訂單</h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-tan border border-sand">
            <p className="text-sm mb-4">尚無訂單記錄</p>
            <Link href="/products" className="text-sm text-brown underline underline-offset-4">
              去選購
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-sand p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-brown font-medium">
                      訂單 #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-tan mt-1">
                      {new Date(order.created_at).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 ${
                    order.status === 'delivered' ? 'bg-sage-light text-sage' :
                    order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    order.status === 'paid' ? 'bg-sand text-brown' :
                    order.status === 'cancelled' ? 'bg-gray-100 text-gray-400' :
                    'bg-tan/20 text-tan'
                  }`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-sand">
                  <p className="text-sm text-brown-mid">
                    收件人：{order.shipping_name}
                  </p>
                  <p className="text-sm font-medium text-brown">
                    NT$ {order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
