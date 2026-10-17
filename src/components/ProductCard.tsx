import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import type { ShopProduct } from '../lib/catalog'
import { readWishlist, toggleWishlist } from '../lib/wishlist'
import { useFinePointer } from '../hooks/useFinePointer'
import { easeLuxury, springSnappy } from '../lib/motion'

export default function ProductCard({ product }: { product: ShopProduct }) {
  const [loved, setLoved] = useState(() => (typeof window === 'undefined' ? false : readWishlist().includes(product.id)))
  const [burst, setBurst] = useState(0)
  const fine = useFinePointer()
  const second = product.images[1]?.src

  return (
    <motion.article
      className="group min-w-0"
      whileHover={fine ? { y: -4 } : undefined}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2, ease: easeLuxury }}
    >
      <div className="relative overflow-hidden rounded-[10px] bg-cream">
        <Link to={`/products/${product.id}`} className="block">
          <img
            src={product.main.src}
            alt={product.name}
            width={320}
            height={400}
            decoding="async"
            loading="lazy"
            className={`aspect-[3/4] w-full object-cover object-top transition duration-700 ease-out ${
              second ? 'group-hover:opacity-0' : 'group-hover:scale-[1.05]'
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
              className="absolute inset-0 aspect-[3/4] h-full w-full object-cover object-top opacity-0 transition duration-700 ease-out group-hover:opacity-100 group-hover:scale-[1.04]"
            />
          )}
        </Link>
        <motion.button
          type="button"
          aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => {
            const next = toggleWishlist(product.id).includes(product.id)
            setLoved(next)
            if (next) setBurst((n) => n + 1)
          }}
          className="icon-btn absolute top-1.5 right-1.5 z-10 min-h-11 min-w-11 rounded-full bg-white/90 text-ink shadow-sm"
          whileTap={{ scale: 0.88 }}
        >
          <motion.span
            key={burst}
            animate={burst > 0 ? { scale: [1, 1.28, 1] } : { scale: 1 }}
            transition={springSnappy}
            className="inline-flex"
          >
            <Heart size={18} strokeWidth={1.5} fill={loved ? 'currentColor' : 'none'} className={loved ? 'text-burgundy' : ''} />
          </motion.span>
        </motion.button>
      </div>
      <div className="pt-3 text-center">
        <h3 className="font-sans text-[13px] font-normal tracking-[0.04em] text-ink">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="mt-1 text-[12px] tracking-[0.02em] text-muted">{product.priceLabel}</p>
      </div>
    </motion.article>
  )
}
