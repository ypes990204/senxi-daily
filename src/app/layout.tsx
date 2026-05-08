import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: '森息日常 | 天然香草淨化儀式用品',
  description: '鼠尾草束、聖木、水晶原石、薰香爐。讓每一天從儀式開始，回到內心的寧靜。',
  keywords: ['鼠尾草', '聖木', '水晶', '薰香', '淨化', '儀式', 'smudge stick', 'palo santo'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  )
}
