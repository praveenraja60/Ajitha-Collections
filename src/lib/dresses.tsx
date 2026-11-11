import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CATEGORIES } from '../data/productInfo'
import {
  buildCatalog,
  type CatalogImage,
  type ShopProduct,
} from './catalog'

export type DressImage = { id: string; src: string }
export type DressVariation = { key: string; price: string; images: DressImage[] }
export type DressEdit = {
  id: number
  parentName: string
  category: string
  removed?: boolean
  variations: DressVariation[]
}

type DressApi = {
  products: ShopProduct[]
  edits: DressEdit[]
  getProduct: (id: number) => ShopProduct | undefined
  searchProducts: (query: string) => ShopProduct[]
  productsByCategory: (category: string) => ShopProduct[]
  categoryCover: (category: string) => ShopProduct | undefined
  relatedProducts: (id: number, limit?: number) => ShopProduct[]
  saveDress: (edit: DressEdit) => Promise<void>
  removeDress: (id: number) => Promise<void>
}

const DressContext = createContext<DressApi | null>(null)

async function fetchEdits() {
  const response = await fetch('/api/dresses')
  if (!response.ok) throw new Error('Could not load dresses')
  const body = (await response.json()) as { dresses?: DressEdit[] }
  return Array.isArray(body.dresses) ? body.dresses : []
}

async function putEdits(dresses: DressEdit[]) {
  const response = await fetch('/api/dresses', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dresses }),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail.trim() || 'Could not save dresses')
  }
  const body = (await response.json()) as { dresses?: DressEdit[] }
  return Array.isArray(body.dresses) ? body.dresses : dresses
}

function formatPrice(raw: string) {
  const n = Number(String(raw).replace(/[^\d.]/g, ''))
  if (!Number.isFinite(n) || n <= 0) return 'Price on enquiry'
  return `₹${n.toLocaleString('en-IN')}`
}

function imagesFrom(edit: DressEdit, fallback: CatalogImage[]): CatalogImage[] {
  const uploaded = edit.variations.flatMap((variation, vi) =>
    variation.images.map((image, ii) => {
      const parts = variation.key.split('.').map(Number)
      return {
        key: variation.key,
        file: image.id,
        src: image.src,
        parts: parts.every((n) => Number.isFinite(n)) ? parts : [edit.id, vi + 1],
        label: variation.key,
        order: vi * 20 + ii,
      } satisfies CatalogImage
    }),
  )
  return uploaded.length ? uploaded : fallback
}

function mergeProduct(base: ShopProduct, edit: DressEdit): ShopProduct {
  const images = imagesFrom(edit, base.images)
  const priceRaw =
    edit.variations.find((v) => v.key === String(edit.id) && v.price.trim())?.price ??
    edit.variations.find((v) => v.price.trim())?.price ??
    ''
  const priceNum = Number(String(priceRaw).replace(/[^\d.]/g, ''))
  return {
    ...base,
    name: edit.parentName.trim() || base.name,
    category: edit.category || base.category,
    price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : base.price,
    priceLabel: priceRaw.trim() ? formatPrice(priceRaw) : base.priceLabel,
    images,
    main: images[0] ?? base.main,
  }
}

function customProduct(edit: DressEdit): ShopProduct {
  const images = imagesFrom(edit, [])
  const placeholder: CatalogImage = {
    key: String(edit.id),
    file: 'placeholder',
    src: '',
    parts: [edit.id],
    label: String(edit.id),
    order: 0,
  }
  const priceRaw =
    edit.variations.find((v) => v.key === String(edit.id) && v.price.trim())?.price ??
    edit.variations.find((v) => v.price.trim())?.price ??
    ''
  const priceNum = Number(String(priceRaw).replace(/[^\d.]/g, ''))
  const gallery = images.length ? images : [placeholder]
  return {
    id: edit.id,
    name: edit.parentName.trim() || `Product ${edit.id}`,
    tagline: 'Ajitha Collection',
    description: 'Boutique piece from Ajitha Collection. Enquire on WhatsApp for fabric, size and availability.',
    price: Number.isFinite(priceNum) && priceNum > 0 ? priceNum : undefined,
    priceLabel: priceRaw.trim() ? formatPrice(priceRaw) : 'Price on enquiry',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: edit.category || CATEGORIES[0],
    availability: 'Made to order · 15 days',
    images: gallery,
    main: gallery[0],
  }
}

export function applyEdits(base: ShopProduct[], edits: DressEdit[]) {
  const byId = new Map(edits.map((edit) => [edit.id, edit]))
  const merged = base.flatMap((product) => {
    const edit = byId.get(product.id)
    if (edit?.removed) return []
    return [edit ? mergeProduct(product, edit) : product]
  })
  const known = new Set(base.map((product) => product.id))
  for (const edit of edits) {
    if (edit.removed || known.has(edit.id)) continue
    merged.push(customProduct(edit))
  }
  return merged.sort((a, b) => a.id - b.id)
}

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i
export const MAX_PRODUCT_IMAGES = 8
export const MAX_IMAGE_BYTES = 6 * 1024 * 1024

export function imageFileError(file: File) {
  const typed = file.type.startsWith('image/')
  const named = IMAGE_EXT.test(file.name)
  if (!typed && !named) return `${file.name} must be JPG, PNG, or WEBP.`
  if (file.size > MAX_IMAGE_BYTES) return `${file.name} is larger than 6 MB.`
  return null
}

export async function uploadDressImage(file: File): Promise<DressImage> {
  const problem = imageFileError(file)
  if (problem) throw new Error(problem)
  const dataUrl = await compressImage(file)
  const response = await fetch('/api/dresses/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  })
  const saved = (await response.json().catch(() => null)) as { id?: string; url?: string; error?: string } | null
  if (!response.ok || !saved?.url) throw new Error(saved?.error || 'Could not store image')
  return { id: saved.id || saved.url, src: saved.url }
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const max = 1100
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(String(reader.result))
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.72))
      }
      img.onerror = () => reject(new Error('This file could not be read as a JPG, PNG, or WEBP image.'))
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export function DressProvider({ children }: { children: ReactNode }) {
  const [edits, setEdits] = useState<DressEdit[]>([])
  const [ready, setReady] = useState(false)
  const base = useMemo(() => buildCatalog(), [])

  useEffect(() => {
    fetchEdits()
      .then(setEdits)
      .catch(() => setEdits([]))
      .finally(() => setReady(true))
  }, [])

  const products = useMemo(() => applyEdits(base, edits), [base, edits])

  const api = useMemo<DressApi>(() => {
    function getProduct(id: number) {
      return products.find((product) => product.id === id)
    }
    function searchProducts(query: string) {
      const q = query.trim().toLowerCase()
      if (!q) return products
      return products.filter(
        (product) =>
          String(product.id).includes(q) ||
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q),
      )
    }
    function productsByCategory(category: string) {
      if (!category || category === 'all') return products
      return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    }
    return {
      products,
      edits,
      getProduct,
      searchProducts,
      productsByCategory,
      categoryCover(category: string) {
        const list = productsByCategory(category)
        if (!list.length) return undefined
        return [...list].sort((a, b) => b.images.length - a.images.length || a.id - b.id)[0]
      },
      relatedProducts(id: number, limit = 4) {
        const current = getProduct(id)
        const rest = products.filter((product) => product.id !== id)
        if (!current) return rest.slice(0, limit)
        const same = rest.filter((product) => product.category === current.category)
        const other = rest.filter((product) => product.category !== current.category)
        return [...same, ...other].slice(0, limit)
      },
      async saveDress(edit: DressEdit) {
        const next = edits.filter((item) => item.id !== edit.id)
        next.push({ ...edit, removed: false })
        setEdits(await putEdits(next))
      },
      async removeDress(id: number) {
        const existing = edits.find((item) => item.id === id)
        const fromCatalog = base.some((product) => product.id === id)
        const next = edits.filter((item) => item.id !== id)
        if (fromCatalog) {
          next.push({
            id,
            parentName: existing?.parentName ?? `Product ${id}`,
            category: existing?.category ?? CATEGORIES[0],
            variations: existing?.variations ?? [],
            removed: true,
          })
        }
        setEdits(await putEdits(next))
      },
    }
  }, [products, edits, base])

  if (!ready) return null

  return <DressContext.Provider value={api}>{children}</DressContext.Provider>
}

export function useDresses() {
  const ctx = useContext(DressContext)
  if (!ctx) throw new Error('useDresses must be used inside DressProvider')
  return ctx
}
