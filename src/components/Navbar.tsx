import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, ShoppingBag, X, Heart } from 'lucide-react'
import { INSTAGRAM_URL, whatsappLink } from '../lib/whatsapp'
import { scrollToId } from '../lib/scroll'
import { useCart } from '../lib/cart'
import { readWishlist, WISHLIST_EVENT } from '../lib/wishlist'
import InstagramGlyph from './InstagramGlyph'
import { CATEGORIES } from '../data/productInfo'
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

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cats, setCats] = useState(false)
  const [query, setQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [wishCount, setWishCount] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const { count } = useCart()
  const onHome = location.pathname === '/'
  const linkClass =
    'text-[13px] font-medium tracking-[0.04em] text-champagne/80 transition-colors hover:text-white'
  const wishLoved = wishCount > 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sync = () => setWishCount(readWishlist().length)
    sync()
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<number[]>).detail
      setWishCount(Array.isArray(detail) ? detail.length : readWishlist().length)
    }
    window.addEventListener(WISHLIST_EVENT, onCustom)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(WISHLIST_EVENT, onCustom)
      window.removeEventListener('storage', sync)
    }
  }, [])

  function goSection(id: string) {
    setOpen(false)
    if (onHome) {
      scrollToId(id)
      return
    }
    navigate('/')
    window.setTimeout(() => scrollToId(id), 50)
  }

  function submitSearch(e: FormEvent) {
    e.preventDefault()
    setSearchOpen(false)
    setOpen(false)
    navigate(`/products?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: easeLuxury }}
      className={`site-header fixed inset-x-0 top-0 z-50 border-b transition-[background,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-burgundy/40 shadow-[0_10px_30px_rgba(20,6,12,0.35)]'
          : 'border-burgundy/30'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 transition-[padding] duration-400 sm:px-6 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        }`}
        aria-label="Primary"
      >
        <Link
          to="/"
          className="flex items-baseline gap-2"
          onClick={(e) => {
            setOpen(false)
            if (location.pathname === '/') e.preventDefault()
            else sessionStorage.removeItem('ajitha-home-y')
          }}
        >
          <span
            className={`font-script leading-none text-gold transition-[font-size] duration-300 ${
              scrolled ? 'text-[28px]' : 'text-[32px]'
            }`}
          >
            Ajitha
          </span>
          <span className="hidden font-display text-[13px] font-semibold tracking-[0.22em] text-champagne/85 uppercase sm:inline">
            Collection
          </span>
        </Link>

        <ul className="hidden items-center gap-5 min-[1100px]:flex">
          <li>
            <Link to="/" className={linkClass}>Home</Link>
          </li>
          <li>
            <Link to="/products" className={linkClass}>Shop</Link>
          </li>
          <li className="relative">
            <button type="button" className={linkClass} onClick={() => setCats((v) => !v)}>
              Categories
            </button>
            <AnimatePresence>
              {cats && (
                <motion.ul
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: easeLuxury }}
                  className="absolute left-0 top-8 z-20 min-w-[160px] rounded-[10px] border border-burgundy/40 bg-wine p-2 shadow-lg"
                >
                  {CATEGORIES.map((c) => (
                    <li key={c}>
                      <Link
                        to={`/products?category=${encodeURIComponent(c)}`}
                        className="block px-3 py-2 text-sm text-champagne/90 hover:bg-burgundy/40 hover:text-white"
                        onClick={() => setCats(false)}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
          <li>
            <button type="button" className={linkClass} onClick={() => goSection('about')}>About</button>
          </li>
          <li>
            <button type="button" className={linkClass} onClick={() => goSection('contact')}>Contact</button>
          </li>
        </ul>

        <div className="flex items-center">
          <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
            <Search size={20} strokeWidth={1.5} />
          </button>
          <Link
            to="/wishlist"
            className={`like-btn like-btn--nav ${wishLoved ? 'is-loved' : ''}`}
            aria-label={wishLoved ? `Wishlist, ${wishCount} saved` : 'Wishlist'}
          >
            <Heart size={18} strokeWidth={2} fill={wishLoved ? 'currentColor' : 'none'} />
          </Link>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="icon-btn hidden sm:inline-flex" aria-label="Instagram">
            <InstagramGlyph />
          </a>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="icon-btn hidden sm:inline-flex" aria-label="WhatsApp">
            <WhatsAppGlyph className="h-[18px] w-[18px]" />
          </a>
          <Link to="/cart" className="icon-btn relative" aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose" />
            )}
          </Link>
          <button type="button" className="icon-btn min-[1100px]:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={submitSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-burgundy/30 bg-wine/95 px-4 py-2.5"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dresses…"
              className="w-full rounded-[10px] border border-burgundy/40 bg-plum/80 px-4 py-2.5 text-sm text-champagne outline-none placeholder:text-champagne/50"
            />
          </motion.form>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeLuxury }}
            className="flex flex-col overflow-hidden border-t border-burgundy/30 bg-wine/95 px-5 py-3 text-champagne min-[1100px]:hidden"
          >
            <li><Link to="/" className="block min-h-11 py-3 text-sm text-champagne/90" onClick={() => setOpen(false)}>Home</Link></li>
            <li><Link to="/products" className="block min-h-11 py-3 text-sm text-champagne/90" onClick={() => setOpen(false)}>Shop</Link></li>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/products?category=${encodeURIComponent(c)}`} className="block min-h-11 py-3 text-sm text-champagne/90" onClick={() => setOpen(false)}>
                  {c}
                </Link>
              </li>
            ))}
            <li>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="block min-h-11 py-3 text-sm text-champagne/90" onClick={() => setOpen(false)}>
                WhatsApp
              </a>
            </li>
            <li><button type="button" className="block min-h-11 w-full py-3 text-left text-sm text-champagne/90" onClick={() => goSection('about')}>About</button></li>
            <li><button type="button" className="block min-h-11 w-full py-3 text-left text-sm text-champagne/90" onClick={() => goSection('contact')}>Contact</button></li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
