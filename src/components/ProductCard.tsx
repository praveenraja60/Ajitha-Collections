import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { ShopProduct } from '../lib/catalog'
import { readWishlist, toggleWishlist } from '../lib/wishlist'

export default function ProductCard({ product }: { product: ShopProduct }) {
  const [loved, setLoved] = useState(() =>
    typeof window === 'undefined' ? false : readWishlist().includes(product.id),
  )
  const second = product.images[1]?.src

  return (
    <article className="group min-w-0 transition-transform duration-200 ease-out hover:-translate-y-1 active:scale-[0.99]">
      <div className="relative overflow-hidden rounded-[12px] bg-gradient-to-b from-cream to-beige/70 ring-1 ring-beige/80">
        <Link to={`/products/${product.id}`} className="block">
          <img
            src={product.main.src}
            alt={product.name}
            width={320}
            height={400}
            decoding="async"
            loading="lazy"
            className={`aspect-[3/4] w-full object-cover object-top transition duration-500 ease-out ${
              second ? 'group-hover:opacity-0' : 'group-hover:scale-[1.04]'
            }`}
          />
          {second && (
            <img
              src={second}
              alt=""
              width={320}
              height={400}
              decoding="async"
              loading="lazy"
              className="absolute inset-0 aspect-[3/4] h-full w-full object-cover object-top opacity-0 transition duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
            />
          )}
        </Link>
        <button
          type="button"
          aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => setLoved(toggleWishlist(product.id).includes(product.id))}
          className={`like-btn absolute top-2 right-2 z-10 ${loved ? 'is-loved' : ''}`}
        >
          <Heart size={17} strokeWidth={1.6} fill={loved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="pt-2 text-center">
        <h3 className="font-display text-[15px] font-semibold tracking-[0.02em] text-ink">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-0.5 text-[12px] tracking-[0.02em] text-rose/90">{product.priceLabel}</p>
      </div>
    </article>
  )
}
