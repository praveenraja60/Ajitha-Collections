import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { getProduct, relatedProducts } from '../lib/catalog'
import ProductGallery from '../components/ProductGallery'
import ProductRail from '../components/ProductRail'
import Seo from '../components/Seo'
import { productEnquiryMessage, whatsappLink } from '../lib/whatsapp'
import { useCart } from '../lib/cart'
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
  const { add } = useCart()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    setGuide(false)
  }, [id])

  if (!product) {
    return (
      <div className="px-4 pt-28 text-center">
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

  function addBag() {
    add(productId, selectedSize)
  }

  return (
    <div className="pb-8">
      <Seo
        title={`${product.name} | Ajitha Collection`}
        description={product.description}
      />
      <article className="mx-auto grid max-w-6xl gap-6 px-4 pt-[4.5rem] sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-8 lg:px-8">
        <div>
          <ProductGallery product={product} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] tracking-[0.28em] text-mauve uppercase">
            {product.category} · {product.id}
          </p>
          <h1 className="mt-2 font-sans text-[2rem] leading-tight sm:text-[2.6rem]">{product.name}</h1>
          <p className="mt-2 text-[15px] tracking-[0.04em] text-muted">{product.priceLabel}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>
          <p className="mt-5 text-[11px] tracking-[0.2em] text-mauve uppercase">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(product.sizes ?? ['S', 'M', 'L']).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`min-h-10 min-w-10 rounded-[10px] border px-3 py-1.5 text-xs tracking-[0.08em] ${selectedSize === s ? 'border-burgundy bg-burgundy text-white' : 'border-beige'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <button type="button" className="mt-2 text-[11px] tracking-wide text-mauve underline" onClick={() => setGuide((v) => !v)}>
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
                    <tr className="text-[10px] tracking-wide text-mauve uppercase">
                      <th className="py-1.5">Size</th>
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
          <p className="mt-3 text-xs text-muted">Inches. Custom measurements welcome on WhatsApp.</p>
          <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[11px] tracking-wide text-mauve uppercase">Availability</dt>
              <dd>{product.availability}</dd>
            </div>
            {product.fabric && (
              <div>
                <dt className="text-[11px] tracking-wide text-mauve uppercase">Fabric</dt>
                <dd>{product.fabric}</dd>
              </div>
            )}
            {product.color && (
              <div>
                <dt className="text-[11px] tracking-wide text-mauve uppercase">Colour</dt>
                <dd>{product.color}</dd>
              </div>
            )}
          </dl>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
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
      {related.length > 0 && <ProductRail eyebrow="You may also like" title="Related pieces" products={related} />}
    </div>
  )
}
