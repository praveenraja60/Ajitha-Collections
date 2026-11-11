import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDresses } from '../lib/dresses'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'

export default function CollectionsPage() {
  const [params] = useSearchParams()
  const { searchProducts, products } = useDresses()
  const q = params.get('q') ?? ''

  const list = useMemo(() => (q ? searchProducts(q) : products), [q, products, searchProducts])

  return (
    <div className="px-4 pb-6 pt-[4.25rem] sm:px-6">
      <Seo
        title="Shop dresses | Ajitha Collection"
        description="Browse the Ajitha Collection dresses. Custom stitching on WhatsApp."
      />
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="eyebrow">Shop</p>
          <h1 className="mt-1 text-[2.2rem] sm:text-[2.75rem]">All Products</h1>
        </div>

        {q && <p className="mt-3 text-sm text-muted">Results for “{q}”</p>}

        <div
          key={q}
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
