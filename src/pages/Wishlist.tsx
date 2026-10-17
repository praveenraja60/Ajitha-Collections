import { Link } from 'react-router-dom'
import { getProduct } from '../lib/catalog'
import { readWishlist } from '../lib/wishlist'
import ProductCard from '../components/ProductCard'
import Seo from '../components/Seo'
import { useMemo, useState } from 'react'

export default function WishlistPage() {
  const [ids] = useState(() => (typeof window === 'undefined' ? [] : readWishlist()))
  const list = useMemo(() => ids.map((id) => getProduct(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)), [ids])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-[4.5rem] sm:px-6">
      <Seo title="Wishlist | Ajitha Collection" />
      <p className="eyebrow">Saved</p>
      <h1 className="mt-2 font-sans text-[2rem]">Wishlist</h1>
      {list.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Nothing saved yet.{' '}
          <Link to="/products" className="underline">
            Browse the edit
          </Link>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
