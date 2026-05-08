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
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/',              destination: '/v4-stitch.html' },
        { source: '/quiz',          destination: '/quiz-stitch.html' },
        { source: '/products',      destination: '/products-stitch.html' },
        { source: '/auth/login',    destination: '/auth-stitch.html' },
        { source: '/auth/register', destination: '/auth-stitch.html' },
        { source: '/checkout',      destination: '/checkout-stitch.html' },
      ],
    }
  },
}

export default nextConfig
