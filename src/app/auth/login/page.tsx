'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('Email 或密碼錯誤')
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
          <p className="text-sm text-tan mt-3">登入您的帳號</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            required
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <p className="text-center text-sm text-tan mt-6">
          還沒有帳號？{' '}
          <Link href="/auth/register" className="text-brown underline underline-offset-4">
            立即註冊
          </Link>
        </p>
      </div>
    </div>
  )
}
