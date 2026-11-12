import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useDresses } from '../lib/dresses'
import ProductGallery from '../components/ProductGallery'
import ProductRail from '../components/ProductRail'
import Seo from '../components/Seo'
import { productEnquiryMessage, stitchLookMessage, whatsappLink } from '../lib/whatsapp'
import { useCart } from '../lib/cart'
import { readWishlist, toggleWishlist } from '../lib/wishlist'
import { easeLuxury } from '../lib/motion'

const FABRICS = ['As shown', 'Silk', 'Cotton', 'Georgette']
const SLEEVES = ['As shown', 'Full', '3/4', 'Sleeveless']
const LENGTHS = ['As shown', 'Knee', 'Ankle', 'Floor']

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
  const { getProduct, relatedProducts } = useDresses()
  const product = getProduct(Number(id))
  const [size, setSize] = useState('M')
  const [fabric, setFabric] = useState(FABRICS[0])
  const [sleeve, setSleeve] = useState(SLEEVES[0])
  const [length, setLength] = useState(LENGTHS[0])
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
        <Link to="/products" className="mt-4 inline-block underline decoration-burgundy underline-offset-4">
          Back to shop
        </Link>
      </div>
    )
  }

  const related = relatedProducts(product.id)
  const selectedSize = product.sizes?.includes(size) ? size : (product.sizes?.[0] ?? 'M')
  const productId = product.id
  const orderHref = whatsappLink(productEnquiryMessage(product.name, product.priceLabel, selectedSize))
  const stitchHref = whatsappLink(
    stitchLookMessage(product.name, product.priceLabel, {
      size: selectedSize,
      fabric,
      sleeve,
      length,
    }),
  )

  function addBag() {
    add(productId, selectedSize)
  }

  return (
    <div className="pb-5">
      <Seo title={`${product.name} | Ajitha Collection`} description={product.description} />
      <article className="mx-auto grid max-w-6xl gap-5 px-4 pt-[4.4rem] sm:px-6 md:grid-cols-2 md:items-start md:gap-8 lg:gap-12">
        <div className="md:sticky md:top-24 md:pl-16 lg:pl-20">
          <ProductGallery product={product} />
        </div>
        <div className="min-w-0 lg:pt-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] tracking-[0.22em] text-burgundy uppercase">
                Ajitha Collection
              </p>
              <h1 className="mt-1 font-display text-[1.7rem] leading-[1.15] font-semibold break-words text-ink sm:text-[2.35rem]">
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

          <p className="mt-3 text-[1.35rem] font-medium tracking-[0.01em] text-burgundy">
            {product.priceLabel}
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted">{product.description}</p>

          <p className="mt-4 text-[11px] tracking-[0.18em] text-burgundy uppercase">Size</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {(product.sizes ?? ['S', 'M', 'L']).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-h-10 min-w-10 rounded-full border px-3 py-1.5 text-xs tracking-[0.08em] transition ${
                  selectedSize === s
                    ? 'border-burgundy bg-burgundy text-white shadow-[0_6px_16px_rgba(196,98,45,0.32)]'
                    : 'border-beige bg-ivory/80 text-ink hover:border-burgundy/40'
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
                    <tr className="text-[10px] tracking-wide text-burgundy uppercase">
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

          <div className="mt-4 rounded-[14px] border border-beige bg-ivory/80 p-3">
            <p className="text-[11px] tracking-[0.18em] text-burgundy uppercase">Stitch my look</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">Choose the finish. WhatsApp opens with this dress and your choices.</p>
            <ChoiceRow label="Fabric" options={FABRICS} value={fabric} onChange={setFabric} />
            <ChoiceRow label="Sleeve" options={SLEEVES} value={sleeve} onChange={setSleeve} />
            <ChoiceRow label="Length" options={LENGTHS} value={length} onChange={setLength} />
            <a
              href={stitchHref}
              target="_blank"
              rel="noreferrer"
              className="btn mt-3 w-full"
            >
              Send this look on WhatsApp
            </a>
          </div>

          <dl className="mt-3 grid gap-1.5 rounded-[10px] bg-cream/70 p-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] tracking-wide text-burgundy uppercase">Availability</dt>
              <dd className="text-ink">{product.availability}</dd>
            </div>
            {product.fabric && (
              <div>
                <dt className="text-[10px] tracking-wide text-burgundy uppercase">Fabric</dt>
                <dd className="text-ink">{product.fabric}</dd>
              </div>
            )}
            {product.color && (
              <div>
                <dt className="text-[10px] tracking-wide text-burgundy uppercase">Colour</dt>
                <dd className="text-ink">{product.color}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a href={orderHref} target="_blank" rel="noreferrer" className="btn sm:col-span-2">
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

function ChoiceRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string
  onChange: (next: string) => void
}) {
  return (
    <div className="mt-2.5">
      <p className="text-[10px] tracking-[0.14em] text-muted uppercase">{label}</p>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-9 rounded-full border px-3 text-xs ${
              value === option ? 'border-burgundy bg-burgundy text-white' : 'border-beige bg-white text-ink'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
