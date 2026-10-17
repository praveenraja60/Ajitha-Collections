import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart, cartWhatsAppText } from '../lib/cart'
import { getProduct } from '../lib/catalog'
import Seo from '../components/Seo'
import { whatsappLink } from '../lib/whatsapp'

export default function CartPage() {
  const { lines, setQty, remove, clear, count } = useCart()

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-[4.5rem] sm:px-6">
      <Seo title="Cart | Ajitha Collection" description="Review your bag and order on WhatsApp." />
      <p className="eyebrow">Bag</p>
      <h1 className="mt-1 font-sans text-3xl">Cart</h1>
      {count === 0 ? (
        <p className="mt-8 text-sm text-muted">
          Your bag is empty.{' '}
          <Link to="/products" className="underline decoration-burgundy underline-offset-4">
            Continue shopping
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-6 space-y-4">
            <AnimatePresence>
            {lines.map((line) => {
              const p = getProduct(line.productId)
              if (!p) return null
              return (
                <motion.li
                  key={`${line.productId}-${line.size}`}
                  initial={false}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex gap-3 rounded-[10px] border border-beige bg-white p-3"
                >
                  <img src={p.main.src} alt={p.name} className="h-24 w-20 object-cover object-top" />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-lg">{p.name}</p>
                    <p className="text-xs text-muted">Size {line.size}</p>
                    <p className="mt-1 text-sm text-muted">{p.priceLabel}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-beige" onClick={() => setQty(line.productId, line.size, line.qty - 1)}>
                        −
                      </button>
                      <span className="text-sm">{line.qty}</span>
                      <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-beige" onClick={() => setQty(line.productId, line.size, line.qty + 1)}>
                        +
                      </button>
                      <button type="button" className="ml-auto text-xs text-muted" onClick={() => remove(line.productId, line.size)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.li>
              )
            })}
            </AnimatePresence>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={whatsappLink(cartWhatsAppText(lines))}
              target="_blank"
              rel="noreferrer"
              className="btn"
            >
              Order on WhatsApp
            </a>
            <button type="button" className="btn btn-outline" onClick={clear}>
              Clear bag
            </button>
          </div>
        </>
      )}
    </div>
  )
}
