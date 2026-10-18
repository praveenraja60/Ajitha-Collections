import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ShopProduct } from '../lib/catalog'
import { preloadMany } from '../lib/preload'
import Lightbox from './Lightbox'

const INTERVAL_MS = 4500
const FADE_S = 0.6

export default function ProductGallery({ product }: { product: ShopProduct }) {
  const images = product.images
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const pauseUntil = useRef(0)
  const touchX = useRef<number | null>(null)
  const current = images[i] ?? images[0]

  useEffect(() => {
    setI(0)
    setOpen(false)
    // Preload only first pair — keeps product pages snappy
    preloadMany(images.slice(0, 2).map((img) => img.src))
  }, [product.id, images])

  useEffect(() => {
    const next = images[(i + 1) % images.length]
    if (next) preloadMany([next.src])
  }, [i, images])

  useEffect(() => {
    if (images.length < 2) return
    const t = window.setInterval(() => {
      if (open) return
      if (Date.now() < pauseUntil.current) return
      setI((n) => (n + 1) % images.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [images.length, open, product.id])

  function hold() {
    pauseUntil.current = Date.now() + 6000
  }

  function go(next: number) {
    if (!images.length) return
    const len = images.length
    setI(((next % len) + len) % len)
    hold()
  }

  function onTouchStart(x: number) {
    touchX.current = x
  }

  function onTouchEnd(x: number) {
    if (touchX.current == null) return
    const dx = x - touchX.current
    touchX.current = null
    if (dx < -36) go(i + 1)
    else if (dx > 36) go(i - 1)
  }

  if (!current) return null

  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <div
        className="relative overflow-hidden bg-cream"
        onPointerEnter={hold}
        onTouchStart={(e) => onTouchStart(e.changedTouches[0].clientX)}
        onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
      >
        <div className="relative w-full">
          {images.map((img, idx) => (
            <motion.img
              key={img.src}
              src={img.src}
              alt={`${product.name} ${img.label}`}
              initial={false}
              animate={{ opacity: idx === i ? 1 : 0 }}
              transition={{ duration: FADE_S, ease: 'easeOut' }}
              draggable={false}
              className={
                idx === i
                  ? 'relative block h-auto w-full select-none object-contain'
                  : 'pointer-events-none absolute inset-0 h-full w-full select-none object-contain'
              }
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => go(i - 1)}
              className="absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[10px] bg-white/90 text-ink"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(i + 1)}
              className="absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-[10px] bg-white/90 text-ink"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>
          </>
        )}

        <button
          type="button"
          aria-label="View larger"
          onClick={() => {
            hold()
            setOpen(true)
          }}
          className="absolute top-2 right-2 z-10 flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/90 text-ink"
        >
          <ZoomIn size={16} strokeWidth={1.5} />
        </button>
      </div>

      <p className="mt-2 text-xs tracking-wide text-muted">
        {current.label} · {i + 1} of {images.length}
      </p>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => go(idx)}
              className={`relative h-[76px] w-[60px] shrink-0 overflow-hidden border bg-cream sm:h-[88px] sm:w-[70px] ${
                idx === i ? 'border-ink' : 'border-beige'
              }`}
              aria-label={`View ${img.label}`}
              aria-current={idx === i}
            >
              <img src={img.src} alt="" width={68} height={84} decoding="async" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          index={i}
          onIndex={(next) => {
            setI(next)
            hold()
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  )
}
