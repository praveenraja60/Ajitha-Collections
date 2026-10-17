import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/whatsapp'
import InstagramGlyph from './InstagramGlyph'
import { scrollToId } from '../lib/scroll'
import { CATEGORIES } from '../data/productInfo'

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.5 3.5A11 11 0 0 0 2.2 16.5L1 22l5.7-1.2A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-3.4.7.7-3.3-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.4.1-.3c0-.1 0-.3 0-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3c.1.2 1.6 2.5 3.8 3.4 1.4.6 1.9.7 2.6.6.4 0 1.2-.5 1.4-1s.2-.9.1-1-.3-.2-.6-.3Z"
      />
    </svg>
  )
}

const heading = 'text-[11px] font-semibold tracking-[0.16em] uppercase text-[#e8d5c4]'
const linkCls = 'text-sm text-white/80 transition hover:text-white'

export default function Footer() {
  const navigate = useNavigate()
  const onHome = useLocation().pathname === '/'

  function goSection(id: string) {
    if (onHome) {
      scrollToId(id)
      return
    }
    navigate('/', { preventScrollReset: true })
    window.setTimeout(() => scrollToId(id), 0)
  }

  return (
    <motion.footer
      className="bg-[#46362c] text-white"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className={heading}>Company name</p>
          <p className="mt-4 font-script text-[2.6rem] leading-none text-[#e8d5c4]">Ajitha Collection</p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">Your Style. Your Design. Our Craft.</p>
          <p className="mt-3 text-sm text-white/65">Premium custom women’s fashion, made to your measurements.</p>
        </div>

        <nav aria-label="Visit">
          <p className={heading}>Visit</p>
          <ul className="mt-4 space-y-2.5">
            <li><button type="button" className={linkCls} onClick={() => goSection('about')}>About Us</button></li>
            <li><button type="button" className={linkCls} onClick={() => goSection('contact')}>Contact Us</button></li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`${linkCls} inline-flex items-center gap-2`}>
                <InstagramGlyph className="h-4 w-4" /> {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${linkCls} inline-flex items-center gap-2`}>
                <WhatsAppGlyph className="h-4 w-4" /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a href={whatsappLink('Hi Ajitha Collection, I need styling assistance.')} target="_blank" rel="noreferrer" className={linkCls}>
                Styling assistance
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Orders">
          <p className={heading}>Orders</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/products" className={linkCls}>All Products</Link></li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/products?category=${encodeURIComponent(c)}`} className={linkCls}>
                  {c}
                </Link>
              </li>
            ))}
            <li><Link to="/cart" className={linkCls}>Cart</Link></li>
            <li><Link to="/wishlist" className={linkCls}>Wishlist</Link></li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className={linkCls}>
                Order on WhatsApp
              </a>
            </li>
            <li className="pt-1 text-sm text-white/65">Made to order · 7–10 days</li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/12">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/55 sm:px-6 lg:px-8">
          © 2026 Ajitha Collection. All rights reserved.
        </p>
      </div>
    </motion.footer>
  )
}
