const KEY = 'ajitha-wishlist'
export const WISHLIST_EVENT = 'ajitha-wishlist'

function emit(ids: number[]) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT, { detail: ids }))
}

export function readWishlist(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

export function wishlistCount(): number {
  return readWishlist().length
}

export function toggleWishlist(id: number): number[] {
  const next = readWishlist()
  const i = next.indexOf(id)
  if (i >= 0) next.splice(i, 1)
  else next.push(id)
  localStorage.setItem(KEY, JSON.stringify(next))
  emit(next)
  return next
}
