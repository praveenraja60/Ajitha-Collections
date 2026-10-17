const KEY = 'ajitha-wishlist'

export function readWishlist(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as number[]) : []
  } catch {
    return []
  }
}

export function toggleWishlist(id: number): number[] {
  const next = readWishlist()
  const i = next.indexOf(id)
  if (i >= 0) next.splice(i, 1)
  else next.push(id)
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
