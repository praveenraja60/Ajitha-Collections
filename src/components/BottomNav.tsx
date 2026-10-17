import { Link, useLocation } from 'react-router-dom'
import { LayoutGroup, motion } from 'framer-motion'
import { Heart, Home, LayoutGrid, Search, ShoppingBag } from 'lucide-react'
import { useCart } from '../lib/cart'
import { springSoft } from '../lib/motion'

const tabs = [
  { to: '/', label: 'Home', icon: Home, match: (p: string) => p === '/' },
  { to: '/products', label: 'Shop', icon: LayoutGrid, match: (p: string) => p.startsWith('/products') },
  { to: '/wishlist', label: 'Saved', icon: Heart, match: (p: string) => p === '/wishlist' },
  { to: '/cart', label: 'Bag', icon: ShoppingBag, match: (p: string) => p === '/cart', badge: true },
  { to: '/products?q=', label: 'Search', icon: Search, match: () => false },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()
  const { count } = useCart()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-beige bg-canvas/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      aria-label="Mobile"
    >
      <LayoutGroup>
        <div className="flex">
          {tabs.map((tab) => {
            const active = tab.match(pathname)
            const Icon = tab.icon
            return (
              <Link
                key={tab.label}
                to={tab.to}
                className={`relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[9px] tracking-[0.16em] uppercase transition-colors ${
                  active ? 'text-burgundy' : 'text-muted'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-glow"
                    className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-burgundy"
                    transition={springSoft}
                  />
                )}
                <motion.span whileTap={{ scale: 0.88 }} className="relative inline-flex">
                  <Icon size={20} strokeWidth={active ? 1.75 : 1.5} />
                  {'badge' in tab && tab.badge && count > 0 && (
                    <span className="absolute -top-0.5 -right-1.5 h-1.5 w-1.5 rounded-full bg-burgundy" />
                  )}
                </motion.span>
                {tab.label}
              </Link>
            )
          })}
        </div>
      </LayoutGroup>
    </nav>
  )
}
