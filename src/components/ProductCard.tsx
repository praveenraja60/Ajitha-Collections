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
      <div className="relative overflow-hidden rounded-[10px] bg-cream">
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
          className="icon-btn absolute top-1.5 right-1.5 z-10 min-h-10 min-w-10 rounded-full bg-white/90 text-ink shadow-sm"
        >
          <Heart
            size={17}
            strokeWidth={1.5}
            fill={loved ? 'currentColor' : 'none'}
            className={loved ? 'text-burgundy' : ''}
          />
        </button>
      </div>
      <div className="pt-2.5 text-center">
        <h3 className="font-sans text-[13px] font-normal tracking-[0.04em] text-ink">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-0.5 text-[12px] tracking-[0.02em] text-muted">{product.priceLabel}</p>
      </div>
    </article>
  )
}
