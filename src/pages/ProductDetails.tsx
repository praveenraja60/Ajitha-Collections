import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { getProduct, relatedProducts } from '../lib/catalog'
import ProductGallery from '../components/ProductGallery'
import ProductRail from '../components/ProductRail'
import Seo from '../components/Seo'
import { productEnquiryMessage, whatsappLink } from '../lib/whatsapp'
import { useCart } from '../lib/cart'
import { readWishlist, toggleWishlist } from '../lib/wishlist'
import { easeLuxury } from '../lib/motion'

const SIZE_GUIDE = [
  { size: 'S', bust: '32–34', waist: '26–28', hip: '36–38' },
  { size: 'M', bust: '34–36', waist: '28–30', hip: '38–40' },
  { size: 'L', bust: '36–38', waist: '30–32', hip: '40–42' },
  { size: 'XL', bust: '38–40', waist: '32–34', hip: '42–44' },
  { size: 'XXL', bust: '40–42', waist: '34–36', hip: '44–46' },
]

export default function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(Number(id))
  const [size, setSize] = useState('M')
  const [guide, setGuide] = useState(false)
  const [loved, setLoved] = useState(false)
  const { add } = useCart()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setGuide(false)
    if (product) setLoved(readWishlist().includes(product.id))
  }, [id, product])

  if (!product) {
    return (
      <div className="px-4 pt-24 text-center">
        <Seo title="Piece not found | Ajitha Collection" />
        <p>We couldn’t find that piece.</p>
        <Link to="/products" className="mt-4 inline-block underline decoration-rose underline-offset-4">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = relatedProducts(product.id)
  const selectedSize = product.sizes?.includes(size) ? size : (product.sizes?.[0] ?? 'M')
  const productId = product.id
  const orderHref = whatsappLink(productEnquiryMessage(product.name, product.priceLabel, selectedSize))

  function addBag() {
    add(productId, selectedSize)
  }

  return (
    <div className="pb-5">
      <Seo title={`${product.name} | Ajitha Collection`} description={product.description} />
      <article className="mx-auto grid max-w-6xl gap-3 px-3 pt-[4rem] sm:gap-4 sm:px-5 lg:grid-cols-2 lg:items-start lg:gap-5 lg:px-6">
        <div>
          <ProductGallery product={product} />
        </div>
        <div className="min-w-0 rounded-[14px] border border-beige/80 bg-ivory/70 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-rose uppercase">
                {product.category} · {product.id}
              </p>
              <h1 className="mt-1 text-[1.9rem] leading-tight text-ink sm:text-[2.5rem]">
                {product.name}
              </h1>
            </div>
            <button
              type="button"
              aria-label={loved ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => setLoved(toggleWishlist(product.id).includes(product.id))}
              className={`like-btn shrink-0 ${loved ? 'is-loved' : ''}`}
            >
              <Heart size={18} strokeWidth={1.6} fill={loved ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="mt-1.5 text-[15px] font-medium tracking-[0.03em] text-burgundy">
            {product.priceLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{product.description}</p>

          <p className="mt-4 text-[11px] tracking-[0.18em] text-rose uppercase">Size</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(product.sizes ?? ['S', 'M', 'L']).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-h-10 min-w-10 rounded-full border px-3 py-1.5 text-xs tracking-[0.08em] transition ${
                  selectedSize === s
                    ? 'border-amber bg-amber text-champagne shadow-[0_6px_16px_rgba(196,98,45,0.35)]'
                    : 'border-beige bg-cream/60 text-ink hover:border-gold'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mt-1.5 text-[11px] tracking-wide text-burgundy underline decoration-gold/60 underline-offset-2"
            onClick={() => setGuide((v) => !v)}
          >
            {guide ? 'Hide size guide' : 'Size guide'}
          </button>
          <AnimatePresence initial={false}>
            {guide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: easeLuxury }}
                className="overflow-hidden"
              >
                <table className="mt-2 w-full text-left text-xs text-muted">
                  <thead>
                    <tr className="text-[10px] tracking-wide text-rose uppercase">
                      <th className="py-1">Size</th>
                      <th>Bust</th>
                      <th>Waist</th>
                      <th>Hip</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map((row) => (
                      <tr key={row.size} className={row.size === selectedSize ? 'text-ink' : ''}>
                        <td className="py-1">{row.size}</td>
                        <td>{row.bust}</td>
                        <td>{row.waist}</td>
                        <td>{row.hip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </AnimatePresence>

          <dl className="mt-3 grid gap-1.5 rounded-[10px] bg-cream/70 p-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] tracking-wide text-rose uppercase">Availability</dt>
              <dd className="text-ink">{product.availability}</dd>
            </div>
            {product.fabric && (
              <div>
                <dt className="text-[10px] tracking-wide text-rose uppercase">Fabric</dt>
                <dd className="text-ink">{product.fabric}</dd>
              </div>
            )}
            {product.color && (
              <div>
                <dt className="text-[10px] tracking-wide text-rose uppercase">Colour</dt>
                <dd className="text-ink">{product.color}</dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <a href={orderHref} target="_blank" rel="noreferrer" className="btn">
              Order size {selectedSize}
            </a>
            <button type="button" onClick={addBag} className="btn btn-outline">
              Add to cart
            </button>
            <button
              type="button"
              onClick={() => {
                addBag()
                navigate('/cart')
              }}
              className="btn btn-outline"
            >
              Buy now
            </button>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <ProductRail eyebrow="You may also like" title="Related pieces" products={related} />
      )}
    </div>
  )
}
