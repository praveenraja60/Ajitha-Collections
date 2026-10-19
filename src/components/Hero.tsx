import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '../lib/heroAssets'
const INTERVAL_MS = 3500
const FADE_S = 0.35

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  const go = useCallback((next: number) => {
    setI(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused || reduce || HERO_SLIDES.length < 2) return
    const t = window.setInterval(() => {
      setI((n) => (n + 1) % HERO_SLIDES.length)
    }, INTERVAL_MS)
    return () => window.clearInterval(t)
  }, [paused, reduce])

  return (
    <section
      className="relative bg-canvas pt-[3.4rem]"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative w-full overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => {
          const active = idx === i
          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={active ? slide.alt : ''}
              loading={idx === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={
                active
                  ? 'relative block h-auto w-full'
                  : 'pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-0'
              }
              style={{
                opacity: active ? 1 : 0,
                transition: reduce ? undefined : `opacity ${FADE_S}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
              draggable={false}
            />
          )
        })}

        {HERO_SLIDES.length > 1 && (
          <>
            <motion.button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(i - 1)}
              className="media-btn absolute top-1/2 left-2 z-10 h-11 w-11 -translate-y-1/2 sm:left-4"
              whileTap={{ scale: 0.94 }}
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </motion.button>
            <motion.button
              type="button"
              aria-label="Next slide"
              onClick={() => go(i + 1)}
              className="media-btn absolute top-1/2 right-2 z-10 h-11 w-11 -translate-y-1/2 sm:right-4"
              whileTap={{ scale: 0.94 }}
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </motion.button>
          </>
        )}
      </div>

      <div className="flex justify-center gap-2 py-2" role="tablist" aria-label="Hero slides">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            aria-selected={idx === i}
            onClick={() => go(idx)}
            className={`h-1 w-7 rounded-full transition-colors duration-200 sm:w-8 ${
              idx === i ? 'bg-burgundy' : 'bg-burgundy/25'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
