import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { getProduct } from './catalog'

export type CartLine = {
  productId: number
  size: string
  qty: number
}

type CartContextValue = {
  lines: CartLine[]
  add: (productId: number, size: string, qty?: number) => void
  remove: (productId: number, size: string) => void
  setQty: (productId: number, size: string, qty: number) => void
  clear: () => void
  count: number
}

const KEY = 'ajitha-cart'
const CartContext = createContext<CartContextValue | null>(null)

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CartLine[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => (typeof window === 'undefined' ? [] : read()))

  function persist(next: CartLine[]) {
    setLines(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  const value = useMemo<CartContextValue>(() => {
    return {
      lines,
      add(productId, size, qty = 1) {
        const next = [...lines]
        const i = next.findIndex((l) => l.productId === productId && l.size === size)
        if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + qty }
        else next.push({ productId, size, qty })
        persist(next)
      },
      remove(productId, size) {
        persist(lines.filter((l) => !(l.productId === productId && l.size === size)))
      },
      setQty(productId, size, qty) {
        if (qty < 1) {
          persist(lines.filter((l) => !(l.productId === productId && l.size === size)))
          return
        }
        persist(lines.map((l) => (l.productId === productId && l.size === size ? { ...l, qty } : l)))
      },
      clear() {
        persist([])
      },
      count: lines.reduce((n, l) => n + l.qty, 0),
    }
  }, [lines])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart')
  return ctx
}

export function cartWhatsAppText(lines: CartLine[]) {
  const rows = lines.map((l) => {
    const p = getProduct(l.productId)
    return `• ${p?.name ?? `Product ${l.productId}`} × ${l.qty} (size ${l.size}) — ${p?.priceLabel ?? ''}`
  })
  return `Hi Ajitha Collection, I would like to order:\n${rows.join('\n')}`
}
