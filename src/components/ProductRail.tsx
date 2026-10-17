import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import type { ShopProduct } from '../lib/catalog'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

const SPEED_PX_S = 58
const COPIES = 3

export default function ProductRail({
  eyebrow,
  title,
  products,
}: {
  eyebrow: string
  title: string
  products: ShopProduct[]
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const loop = useMemo(() => {
    if (products.length === 0) return []
    return Array.from({ length: COPIES }, () => products).flat()
  }, [products])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

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

  function pause() {
    setPaused(true)
  }

  function resume() {
    setPaused(false)
  }

  useEffect(() => {
    const el = scroller.current
    if (!el || products.length === 0 || reduce) return

    // Start mid-track so wrap works in both directions
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
      if (!pausedRef.current && el.scrollWidth > el.clientWidth) {
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
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2 font-sans text-[1.85rem] leading-tight sm:text-[2.15rem]">{title}</h2>
          </div>
          <div className="flex gap-1">
            <motion.button
              type="button"
              className="icon-btn min-h-11 min-w-11 border border-beige"
              aria-label="Previous products"
              onClick={() => move(-1)}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              type="button"
              className="icon-btn min-h-11 min-w-11 border border-beige"
              aria-label="Next products"
              onClick={() => move(1)}
              whileTap={{ scale: 0.92 }}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </motion.button>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="flex gap-3 overflow-x-hidden pb-2 sm:gap-4"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
          onPointerDown={pause}
          onPointerUp={resume}
        >
          {loop.map((product, i) => (
            <div
              key={`${product.id}-${i}`}
              className="w-[46vw] max-w-[260px] min-w-[160px] shrink-0 sm:w-[230px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
