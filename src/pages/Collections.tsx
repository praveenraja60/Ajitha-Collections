import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LayoutGroup, motion } from 'framer-motion'
import { CATEGORIES } from '../data/productInfo'
import { products, searchProducts } from '../lib/catalog'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { springSoft } from '../lib/motion'

export default function CollectionsPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? 'all'

  const list = useMemo(() => {
    let next = q ? searchProducts(q) : products
    if (category !== 'all') next = next.filter((p) => p.category === category)
    return next
  }, [q, category])

  function setCategory(c: string) {
    const next = new URLSearchParams(params)
    if (c === 'all') next.delete('category')
    else next.set('category', c)
    setParams(next)
  }

  const chips = ['all', ...CATEGORIES] as const

  return (
    <div className="px-4 pb-6 pt-[4.25rem] sm:px-6">
      <Seo
        title="Shop dresses | Ajitha Collection"
        description="Browse festive, occasion, everyday and statement looks. Custom stitching on WhatsApp."
      />
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="mt-1 text-[2.2rem] sm:text-[2.75rem]">All Products</h1>
        </div>

        <LayoutGroup>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {chips.map((c) => {
              const active = category === c
              const label = c === 'all' ? 'All' : c
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`relative shrink-0 overflow-hidden rounded-[10px] border px-4 py-2.5 text-[11px] tracking-[0.14em] uppercase transition-colors ${
                    active ? 'border-ink text-white' : 'border-beige bg-transparent text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="shop-chip"
                      className="absolute inset-0 bg-ink"
                      transition={springSoft}
                    />
                  )}
                  <span className="relative z-[1]">{label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        {q && <p className="mt-3 text-sm text-muted">Results for “{q}”</p>}

        <div
          key={`${category}-${q}`}
          className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-4"
        >
          {list.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {list.length === 0 && <p className="mt-10 text-sm text-muted">No pieces match this filter.</p>}
      </div>
    </div>
  )
}
