import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { motion } from 'framer-motion'
import type { ShopProduct } from '../lib/catalog'
import { preloadMany } from '../lib/preload'
import Lightbox from './Lightbox'

const INTERVAL_MS = 4500
const FADE_S = 0.45

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
        className="relative overflow-hidden rounded-[12px] bg-gradient-to-b from-cream to-beige/60"
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
              className="media-btn absolute top-1/2 left-2 z-10 -translate-y-1/2"
            >
              <ChevronLeft size={20} strokeWidth={1.6} />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => go(i + 1)}
              className="media-btn absolute top-1/2 right-2 z-10 -translate-y-1/2"
            >
              <ChevronRight size={20} strokeWidth={1.6} />
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
          className="media-btn absolute top-2 right-2 z-10"
        >
          <ZoomIn size={16} strokeWidth={1.6} />
        </button>
      </div>

      <p className="mt-1.5 text-[11px] tracking-wide text-muted">
        {current.label} · {i + 1} of {images.length}
      </p>

      {images.length > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.src}
              type="button"
              onClick={() => go(idx)}
              className={`relative h-[68px] w-[54px] shrink-0 overflow-hidden rounded-lg border-2 bg-cream sm:h-[78px] sm:w-[62px] ${
                idx === i ? 'border-rose shadow-[0_0_0_1px_rgba(183,110,121,0.25)]' : 'border-beige'
              }`}
              aria-label={`View ${img.label}`}
              aria-current={idx === i}
            >
              <img src={img.src} alt="" width={62} height={78} decoding="async" className="h-full w-full object-cover object-top" />
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
