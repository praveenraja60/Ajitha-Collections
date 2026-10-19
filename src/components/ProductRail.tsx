import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import type { ShopProduct } from '../lib/catalog'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

const SPEED_PX_S = 52
const COPIES = 2

export default function ProductRail({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string
  title: string
  products: ShopProduct[]
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const onScreenRef = useRef(true)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const loop = useMemo(() => {
    if (products.length === 0) return []
    return Array.from({ length: COPIES }, () => products).flat()
  }, [products])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreenRef.current = entry.isIntersecting
      },
      { rootMargin: '80px', threshold: 0 },
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  function unitWidth(el: HTMLDivElement) {
    return el.scrollWidth / COPIES
  }

  function wrap(el: HTMLDivElement) {
    const unit = unitWidth(el)
    if (unit <= 0) return
    if (el.scrollLeft >= unit) el.scrollLeft -= unit
    else if (el.scrollLeft <= 0) el.scrollLeft += unit
  }

  function move(dir: number) {
    const el = scroller.current
    if (!el) return
    el.scrollLeft += dir * Math.min(280, el.clientWidth * 0.7)
    wrap(el)
  }

  useEffect(() => {
    const el = scroller.current
    if (!el || products.length === 0 || reduce) return

    const boot = () => {
      const unit = unitWidth(el)
      if (unit > 0 && el.scrollLeft < 8) el.scrollLeft = unit
    }
    boot()
    const t = window.setTimeout(boot, 200)
    const ro = new ResizeObserver(boot)
    ro.observe(el)

    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(40, now - last)
      last = now
      if (onScreenRef.current && !pausedRef.current && el.scrollWidth > el.clientWidth) {
        el.scrollLeft += (SPEED_PX_S * dt) / 1000
        wrap(el)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(t)
      ro.disconnect()
    }
  }, [products, loop.length, reduce])

  return (
    <section ref={sectionRef} className="px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-1.5 text-[1.85rem] leading-tight sm:text-[2.2rem]">{title}</h2>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              className="icon-btn min-h-10 min-w-10 border border-beige"
              aria-label="Previous products"
              onClick={() => move(-1)}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              className="icon-btn min-h-10 min-w-10 border border-beige"
              aria-label="Next products"
              onClick={() => move(1)}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="flex gap-2.5 overflow-x-hidden pb-1 sm:gap-3.5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
        >
          {loop.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-[44vw] max-w-[240px] min-w-[150px] shrink-0 sm:w-[210px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
