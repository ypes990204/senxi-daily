/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // Stitch 1:1 視覺：把核心頁面 rewrite 到 Stitch HTML
  // 這些頁面變成純展示（無互動），等視覺確認後再做功能化
  // 順序：specific path 在前，動態 :slug 在後
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/',                       destination: '/v4-stitch.html' },
        { source: '/quiz',                   destination: '/quiz-stitch.html' },
        // 商品分類列表（specific path 必須在 :slug 之前）
        { source: '/products',               destination: '/products-stitch.html' },
        { source: '/products/herbs',         destination: '/herbs-stitch.html' },
        { source: '/products/crystal-sets',  destination: '/crystals-stitch.html' },
        { source: '/products/energy-wands',  destination: '/products-stitch.html' },
        // 商品詳情（catch-all，必須在分類之後）
        { source: '/products/:slug',         destination: '/product-detail-stitch.html' },
        // 其他主要頁面
        { source: '/about',                  destination: '/about-stitch.html' },
        { source: '/journal',                destination: '/journal-stitch.html' },
        { source: '/account',                destination: '/account-stitch.html' },
        { source: '/checkout/success',       destination: '/checkout-success-stitch.html' },
        { source: '/checkout',               destination: '/checkout-stitch.html' },
        { source: '/auth/login',             destination: '/auth-stitch.html' },
        { source: '/auth/register',          destination: '/auth-stitch.html' },
      ],
    }
  },
}

export default nextConfig
