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
    <div className="mx-auto max-w-7xl px-4 pb-6 pt-[4.25rem] sm:px-6">
      <Seo title="Wishlist | Ajitha Collection" />
      <p className="eyebrow">Saved</p>
      <h1 className="mt-1.5 font-sans text-[1.85rem]">Wishlist</h1>
      {list.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          Nothing saved yet.{' '}
          <Link to="/products" className="underline">
            Browse the edit
          </Link>
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-3.5">
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
