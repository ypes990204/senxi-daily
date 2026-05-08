import { createClient } from '@/lib/supabase'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import { PRODUCTS, getByCategory } from '@/lib/products'

const CATEGORIES = [
  { value: '', label: '全部商品' },
  { value: 'herbs', label: '草本系列' },
  { value: 'crystal-sets', label: '水晶套裝' },
  { value: 'energy-wands', label: '能量草杖' },
]

async function getProducts(category: string): Promise<Product[]> {
  try {
    const supabase = createClient()
    let query = supabase.from('products').select('*').order('created_at', { ascending: false })
    if (category) query = query.eq('category', category)
    const { data } = await query
    if (data && data.length > 0) return data
  } catch {
    // fallthrough
  }
  return category ? getByCategory(category) : PRODUCTS
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const category = searchParams.category ?? ''
  const products = await getProducts(category)
  const currentCat = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="section-title">{currentCat.label}</h1>
        <p className="text-sm text-tan mt-2">{products.length} 件商品</p>
      </div>

      {/* 分類篩選 */}
      <div className="flex gap-3 flex-wrap mb-10 border-b border-sand pb-6">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.value}
            href={cat.value ? `/products?category=${cat.value}` : '/products'}
            className={`text-xs px-4 py-2 tracking-widest transition-colors ${
              category === cat.value
                ? 'bg-brown text-cream'
                : 'border border-sand text-brown-mid hover:border-brown hover:text-brown'
            }`}
          >
            {cat.label}
          </a>
        ))}
      </div>

      {/* 商品格 */}
      {products.length === 0 ? (
        <div className="text-center py-20 text-tan">
          <p>此分類暫無商品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
