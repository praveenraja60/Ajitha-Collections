import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/whatsapp'
import InstagramGlyph from './InstagramGlyph'
import { scrollToId } from '../lib/scroll'
import { easeLuxury } from '../lib/motion'

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

export default function Footer() {
  const navigate = useNavigate()
  const onHome = useLocation().pathname === '/'
  const year = new Date().getFullYear()

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
      className="site-footer relative overflow-hidden border-t border-gold/20 text-champagne"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.3, ease: easeLuxury }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(700px 320px at 12% 0%, rgba(196,98,45,0.22), transparent 55%), linear-gradient(165deg, #3a2a22 0%, #2a1e18 55%, #1a1310 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <p className="text-[10px] tracking-[0.32em] text-gold uppercase">The atelier</p>
          <p className="mt-2 font-script text-[3rem] leading-none text-gold sm:text-[3.6rem]">
            Ajitha
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.36em] text-champagne/80 uppercase">
            Collection
          </p>
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-muted">
            Your style. Your design. Our craft.
          </p>
        </div>

        <div className="mx-auto mt-5 flex flex-col items-stretch justify-center gap-2 sm:max-w-lg sm:flex-row sm:items-center">
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-amber px-5 text-[11px] font-semibold tracking-[0.12em] text-champagne uppercase transition hover:bg-[#d4783a]"
          >
            <WhatsAppGlyph className="h-4 w-4" />
            Order on WhatsApp
          </a>
          <div className="inline-flex min-h-11 items-center justify-center rounded-full border border-gold/35 px-4 text-[10px] tracking-[0.14em] text-gold uppercase">
            Made to order · 15 days
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3 border-t border-gold/15 pt-4 sm:flex-row sm:justify-between">
          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] tracking-[0.06em] text-muted"
          >
            <Link to="/products" className="transition hover:text-gold">
              Shop
            </Link>
            <button type="button" className="transition hover:text-gold" onClick={() => goSection('about')}>
              About
            </button>
            <button type="button" className="transition hover:text-gold" onClick={() => goSection('contact')}>
              Contact
            </button>
            <Link to="/wishlist" className="transition hover:text-gold">
              Wishlist
            </Link>
            <Link to="/cart" className="transition hover:text-gold">
              Cart
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label={INSTAGRAM_HANDLE}
              title={INSTAGRAM_HANDLE}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:bg-gold/10"
            >
              <InstagramGlyph className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
              title={WHATSAPP_DISPLAY}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:bg-gold/10"
            >
              <WhatsAppGlyph className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] tracking-[0.05em] text-muted">
          © {year} Ajitha Collection
        </p>
      </div>
    </motion.footer>
  )
}
