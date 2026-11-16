import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import type { ShopProduct } from '../lib/catalog'
import { preloadMany } from '../lib/preload'
import Lightbox from './Lightbox'

const INTERVAL_MS = 4500

export default function ProductGallery({ product }: { product: ShopProduct }) {
  const images = product.images.filter((img) => img.src)
  const imageKey = images.map((img) => img.src).join('|')
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const pauseUntil = useRef(0)
  const scroller = useRef<HTMLDivElement>(null)
  const lockScroll = useRef(false)
  const current = images[i] ?? images[0]

  useEffect(() => {
    setI(0)
    setOpen(false)
    preloadMany(images.slice(0, 2).map((img) => img.src))
    // Reset only when this dress or its photo list changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id, imageKey])

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

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const left = i * el.clientWidth
    if (Math.abs(el.scrollLeft - left) <= 4) return
    lockScroll.current = true
    el.scrollTo({ left, behavior: 'smooth' })
    const timer = window.setTimeout(() => {
      lockScroll.current = false
    }, 480)
    return () => window.clearTimeout(timer)
  }, [i, imageKey])

  function go(next: number) {
    if (!images.length) return
    const len = images.length
    setI(((next % len) + len) % len)
    hold()
  }

  function onStripScroll() {
    if (lockScroll.current) return
    const el = scroller.current
    if (!el || el.clientWidth < 1) return
    const index = Math.min(images.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)))
    setI((currentIndex) => {
      if (currentIndex === index) return currentIndex
      pauseUntil.current = Date.now() + 6000
      return index
    })
  }

  if (!current) return null

  return (
    <div className="w-full min-w-0 overflow-x-clip">
      <div
        className="relative overflow-hidden rounded-[16px] bg-gradient-to-b from-cream to-beige/60 shadow-[0_16px_40px_rgba(60,51,48,0.06)]"
        onPointerEnter={hold}
      >
        <div
          ref={scroller}
          onScroll={onStripScroll}
          className="flex aspect-[3/4] w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain scrollbar-hide max-lg:h-[50vh] max-lg:aspect-auto"
        >
          {images.map((img, idx) => (
            <img
              key={`${img.src}-${idx}`}
              src={img.src}
              alt={`${product.name} ${img.label}`}
              draggable={false}
              className="h-full min-w-full flex-[0_0_100%] snap-center object-contain select-none"
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
              key={`${img.src}-thumb-${idx}`}
              type="button"
              onClick={() => go(idx)}
              ref={(node) => {
                if (node && idx === i) node.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
              }}
              className={`relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border-2 bg-cream sm:h-[72px] sm:w-14 ${
                idx === i ? 'border-burgundy' : 'border-beige'
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
