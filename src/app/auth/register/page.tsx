'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('兩次密碼不一致')
      return
    }
    if (form.password.length < 6) {
      setError('密碼至少需要 6 個字元')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      router.push('/account')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="font-serif text-2xl text-brown tracking-widest">
            森息日常
          </Link>
          <p className="text-sm text-tan mt-3">建立您的帳號</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input required placeholder="姓名" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" />
          <input required type="password" placeholder="密碼（至少 6 字元）" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" />
          <input required type="password" placeholder="確認密碼" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="input-field" />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? '建立中...' : '建立帳號'}
          </button>
        </form>

        <p className="text-center text-sm text-tan mt-6">
          已有帳號？{' '}
          <Link href="/auth/login" className="text-brown underline underline-offset-4">
            登入
          </Link>
        </p>
      </div>
    </div>
  )
}
