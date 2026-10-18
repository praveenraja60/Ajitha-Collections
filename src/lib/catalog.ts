import { HERO_FILE, IMAGE_BASE, IMAGE_FILES } from '../data/imageFiles.generated'
import { CATEGORIES, productInfo } from '../data/productInfo'

export type CatalogImage = {
  key: string
  file: string
  src: string
  parts: number[]
  label: string
  order: number
}

export type ShopProduct = {
  id: number
  name: string
  tagline: string
  description: string
  priceLabel: string
  price?: number
  fabric?: string
  color?: string
  sizes?: string[]
  category: string
  availability: string
  images: CatalogImage[]
  main: CatalogImage
}

const KEY_RE = /^(\d+(?:\.\d+)*)\.(jpe?g|png|webp)$/i

export function parseImageKey(filename: string): string | null {
  const m = filename.match(KEY_RE)
  return m ? m[1] : null
}

export function srcFor(file: string) {
  return `${IMAGE_BASE}/${file}`
}

export function heroSrc(): string | null {
  return HERO_FILE ? srcFor(HERO_FILE) : null
}

function compareParts(a: number[], b: number[]) {
  const n = Math.max(a.length, b.length)
  for (let i = 0; i < n; i++) {
    const da = a[i] ?? -1
    const db = b[i] ?? -1
    if (da !== db) return da - db
  }
  return 0
}

export function childrenOf(images: CatalogImage[], parentKey: string) {
  const depth = parentKey.split('.').length + 1
  return images.filter((img) => img.key.startsWith(`${parentKey}.`) && img.key.split('.').length === depth)
}

export function hasChildren(images: CatalogImage[], key: string) {
  return childrenOf(images, key).length > 0
}

export function rootThumbs(product: ShopProduct) {
  return product.images.filter((img) => img.parts.length <= 2)
}

export function thumbsFor(product: ShopProduct, selectedKey: string) {
  const depth = selectedKey.split('.').length
  if (depth >= 2) {
    const nested = childrenOf(product.images, selectedKey)
    if (nested.length) return nested
  }
  return rootThumbs(product)
}

export function isNestedGroup(images: CatalogImage[], selectedKey: string) {
  return selectedKey.split('.').length >= 2 && childrenOf(images, selectedKey).length > 0
}

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function toProduct(id: number, images: CatalogImage[]): ShopProduct {
  const extra = productInfo[id] ?? {}
  const main =
    images.find((img) => img.key === String(id)) ??
    images[0]
  const name = extra.name ?? `Product ${id}`
  return {
    id,
    name,
    tagline: extra.tagline ?? 'Ajitha Collection',
    description:
      extra.description ??
      'Boutique piece from Ajitha Collection. Enquire on WhatsApp for fabric, size, colour and availability.',
    price: extra.price,
    priceLabel: extra.priceLabel ?? (extra.price != null ? formatPrice(extra.price) : 'Price on enquiry'),
    fabric: extra.fabric,
    color: extra.color,
    sizes: extra.sizes ?? ['S', 'M', 'L', 'XL', 'XXL'],
    category: extra.category ?? CATEGORIES[(id - 1) % CATEGORIES.length],
    availability: 'Made to order · 15 days',
    images,
    main,
  }
}

export function buildCatalog(files: readonly string[] = IMAGE_FILES): ShopProduct[] {
  const byId = new Map<number, CatalogImage[]>()
  for (const file of files) {
    const key = parseImageKey(file)
    if (!key) continue
    const parts = key.split('.').map(Number)
    const id = parts[0]
    const list = byId.get(id) ?? []
    list.push({ key, file, src: srcFor(file), parts, label: key, order: 0 })
    byId.set(id, list)
  }
  return [...byId.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([id], index, rows) => rows.findIndex((row) => row[0] === id) === index)
    .map(([id, images]) => {
      const sorted = [...images].sort((a, b) => compareParts(a.parts, b.parts)).map((img, i) => ({
        ...img,
        order: i + 1,
        label: `${id}.${i + 1}`,
      }))
      return toProduct(id, sorted)
    })
}

export const products = buildCatalog()

export function getProduct(id: number) {
  return products.find((p) => p.id === id)
}

export function searchProducts(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return products
  return products.filter(
    (p) =>
      String(p.id).includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
  )
}

export function productsByCategory(category: string) {
  if (!category || category === 'all') return products
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
}

export function categoryCover(category: string) {
  const list = productsByCategory(category)
  if (!list.length) return undefined
  return [...list].sort((a, b) => b.images.length - a.images.length || a.id - b.id)[0]
}

export function relatedProducts(id: number, limit = 4) {
  const current = getProduct(id)
  if (!current) return products.filter((p) => p.id !== id).slice(0, limit)
  const same = products.filter((p) => p.id !== id && p.category === current.category)
  const rest = products.filter((p) => p.id !== id && p.category !== current.category)
  return [...same, ...rest].slice(0, limit)
}

export function heroSlides() {
  const hero = heroSrc()
  const picks = [1, 6, 12, 18]
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const slides = [
    hero
      ? { src: hero, title: 'Ajitha Collection', copy: 'Your Style. Your Design. Our Craft.', cta: 'Shop Now', to: '/products' }
      : null,
    ...picks.slice(hero ? 0 : 0, hero ? 3 : 4).map((p, i) => ({
      src: p.main.src,
      title: p.name,
      copy: p.tagline,
      cta: i % 2 === 0 ? 'Explore Collection' : 'Order Now',
      to: `/products/${p.id}`,
    })),
  ].filter((s): s is NonNullable<typeof s> => Boolean(s))
  return slides.slice(0, 4)
}
