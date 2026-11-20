import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HERO_SLIDES } from '../lib/heroAssets'
const INTERVAL_MS = 3000
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
      className="relative pt-[6.6rem] md:px-6 md:pt-32"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <h1 className="sr-only md:hidden">Your style. Your design.</h1>
      <div className="mx-auto grid max-w-7xl items-center md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-12">
        <div className="hidden md:order-1 md:block md:pl-16 lg:pl-20">
          <p className="eyebrow">The atelier</p>
          <h1 className="mt-2 font-display text-[2.6rem] leading-[0.92] font-semibold text-ink sm:text-6xl md:text-[4.2rem]">
            <SplitLine text="Your style." reduce={!!reduce} />
            <span className="mt-1 block font-script text-[2.4rem] font-normal text-burgundy sm:text-6xl md:text-[4.4rem]">
              <SplitLine text="Your design." reduce={!!reduce} delay={0.2} />
            </span>
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Boutique dresses, stitched to your measurements. Choose a look and order on WhatsApp — ready in 15 days.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Magnet className="inline-flex">
              <Link to="/products" className="btn">
                Explore collection
              </Link>
            </Magnet>
          </div>
        </div>

        <div className="md:order-2">
          <div className="crystal-frame relative overflow-hidden bg-cream md:rounded-[22px] md:shadow-[0_18px_50px_rgba(60,51,48,0.08)]">
            <span key={i} className="crystal-frame__glint" aria-hidden="true" />
            <div className="relative w-full">
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
                        ? 'relative block h-auto w-full md:max-h-[72vh] md:object-contain'
                        : 'pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 md:object-contain'
                    }
                    style={{
                      opacity: active ? 1 : 0,
                      transition: reduce ? undefined : `opacity ${FADE_S}s cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                    draggable={false}
                  />
                )
              })}
            </div>
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
          <div className="flex justify-center gap-2 py-2.5 md:mt-3 md:py-0" role="tablist" aria-label="Hero slides">
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
        </div>
        <div className="order-2 px-4 pt-2 pb-4 md:hidden">
          <h2 className="font-display text-[1.7rem] leading-tight text-ink">
            Your style.
            <span className="mt-1 block font-script text-[2.1rem] font-normal text-burgundy">Your design.</span>
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Boutique dresses, stitched to your measurements. Choose a look and order on WhatsApp — ready in 15 days.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Link to="/products" className="btn">Explore collection</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function SplitLine({ text, reduce, delay = 0 }: { text: string; reduce: boolean; delay?: number }) {
  if (reduce) return <>{text}</>
  return (
    <>
      {text.split(' ').map((word, index) => (
        <motion.span
          key={word}
          className="mr-[0.22em] inline-block"
          initial={{ y: '0.45em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: delay + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
        </motion.span>
      ))}
    </>
  )
}

function Magnet({ className, children }: { className?: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })
  const ref = useRef<HTMLDivElement>(null)

  function move(event: PointerEvent) {
    if (reduce || !ref.current) return
    const box = ref.current.getBoundingClientRect()
    x.set((event.clientX - (box.left + box.width / 2)) * 0.28)
    y.set((event.clientY - (box.top + box.height / 2)) * 0.28)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduce ? undefined : { x: springX, y: springY }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
