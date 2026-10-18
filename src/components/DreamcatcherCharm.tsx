import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Hangly-style interactive dreamcatcher.
 * Physics painted via DOM refs (no React re-render each frame) for a smooth site.
 * Slow, heavy swing so it feels like a real hanging charm.
 */

const MAX_ANGLE = 0.55
/** Higher length + softer gravity = slower, more realistic dance */
const GRAVITY = 4.2
const LENGTH = 2.4
const DAMPING = 0.992
const IDLE_AMP = 0.028
const IDLE_SPEED = 0.28

export default function DreamcatcherCharm() {
  const reduce = useReducedMotion()
  const pivotRef = useRef<HTMLDivElement>(null)
  const swingRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const velRef = useRef(0)
  const draggingRef = useRef(false)
  const lastTRef = useRef(0)
  const idleTRef = useRef(0)
  const visibleRef = useRef(true)
  const [dragging, setDragging] = useState(false)

  const paint = useCallback((a: number) => {
    angleRef.current = a
    const el = swingRef.current
    if (el) el.style.transform = `rotate(${(a * 180) / Math.PI}deg)`
  }, [])

  useEffect(() => {
    const root = swingRef.current?.closest('.dreamcatcher-charm')
    if (!root) return
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
      },
      { threshold: 0 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce) return
    let frame = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now

      if (visibleRef.current && !draggingRef.current) {
        const accel = (-GRAVITY / LENGTH) * Math.sin(angleRef.current)
        velRef.current = (velRef.current + accel * dt) * DAMPING

        if (Math.abs(velRef.current) < 0.04 && Math.abs(angleRef.current) < 0.04) {
          idleTRef.current += dt
          paint(Math.sin(idleTRef.current * IDLE_SPEED) * IDLE_AMP)
        } else {
          idleTRef.current = 0
          let next = angleRef.current + velRef.current * dt
          next = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, next))
          if (Math.abs(next) >= MAX_ANGLE) velRef.current *= -0.28
          paint(next)
          if (Math.abs(velRef.current) < 0.0015 && Math.abs(next) < 0.0015) {
            velRef.current = 0
          }
        }
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce, paint])

  const pointerToAngle = useCallback((clientX: number, clientY: number) => {
    const pivot = pivotRef.current
    if (!pivot) return 0
    const r = pivot.getBoundingClientRect()
    const px = r.left + r.width / 2
    const py = r.top + r.height / 2
    return Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, Math.atan2(clientX - px, clientY - py)))
  }, [])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduce) return
      e.preventDefault()
      e.stopPropagation()
      e.currentTarget.setPointerCapture(e.pointerId)
      draggingRef.current = true
      setDragging(true)
      velRef.current = 0
      lastTRef.current = performance.now()
      paint(pointerToAngle(e.clientX, e.clientY))
    },
    [paint, pointerToAngle, reduce],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      e.preventDefault()
      const now = performance.now()
      const a = pointerToAngle(e.clientX, e.clientY)
      const dt = Math.max(0.01, (now - lastTRef.current) / 1000)
      velRef.current = (a - angleRef.current) / dt
      lastTRef.current = now
      paint(a)
    },
    [paint, pointerToAngle],
  )

  const onPointerUp = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
    // Soft throw — charm settles slowly
    velRef.current = Math.max(-2.2, Math.min(2.2, velRef.current * 0.85))
  }, [])

  return (
    <aside
      className="dreamcatcher-charm fixed top-0 left-0 z-40 select-none sm:left-1 lg:left-2"
      aria-label="Interactive hanging dreamcatcher — drag to swing"
    >
      <div ref={pivotRef} className="absolute top-0 left-1/2 h-1 w-1 -translate-x-1/2" />

      <div ref={swingRef} className="origin-top touch-none will-change-transform">
        <div className="relative mx-auto flex w-8 flex-col items-center sm:w-10">
          <div className="h-[4.5rem] w-[1.5px] rounded-full bg-gradient-to-b from-[#c4a484]/80 via-[#564438] to-[#564438] sm:h-20 lg:h-24" />
          <div className="absolute top-4 h-1.5 w-1.5 rounded-full bg-[#c4a484] shadow-sm" />
          <div className="absolute top-10 h-1 w-1 rounded-full bg-[#564438]/80 sm:top-12" />
        </div>

        <div
          role="img"
          aria-label="Dreamcatcher charm"
          className={`relative cursor-grab active:cursor-grabbing ${dragging ? 'scale-[1.02]' : ''} transition-transform duration-200`}
          style={{ touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg
            viewBox="0 0 120 220"
            className="h-[10.5rem] w-[5.5rem] drop-shadow-[0_10px_20px_rgba(70,54,44,0.2)] sm:h-[13rem] sm:w-[6.75rem] lg:h-[15rem] lg:w-[7.75rem]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="48" r="36" stroke="#564438" strokeWidth="3.4" fill="#faf6f1" fillOpacity="0.62" />
            <circle cx="60" cy="48" r="32.5" stroke="#c4a484" strokeWidth="1.35" opacity="0.9" />
            <circle cx="60" cy="48" r="24" stroke="#564438" strokeWidth="0.7" opacity="0.42" />
            <circle cx="60" cy="48" r="15.5" stroke="#564438" strokeWidth="0.7" opacity="0.38" />
            <circle cx="60" cy="48" r="7.5" stroke="#564438" strokeWidth="0.7" opacity="0.42" />
            {[0, 30, 60, 90, 120, 150].map((d) => {
              const rad = (d * Math.PI) / 180
              return (
                <line
                  key={d}
                  x1="60"
                  y1="48"
                  x2={60 + Math.cos(rad) * 32}
                  y2={48 + Math.sin(rad) * 32}
                  stroke="#564438"
                  strokeWidth="0.65"
                  opacity="0.38"
                />
              )
            })}
            <circle cx="60" cy="48" r="5" fill="#564438" />
            <circle cx="60" cy="48" r="2.4" fill="#e8d5c4" />
            {[
              [60, 12],
              [88, 26],
              [94, 56],
              [78, 80],
              [42, 80],
              [26, 56],
              [32, 26],
            ].map(([cx, cy], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={i % 2 === 0 ? 2.5 : 2}
                fill={i % 3 === 0 ? '#c4a484' : '#564438'}
                opacity="0.92"
              />
            ))}
            <path d="M42 84 Q39 120 36 162" stroke="#564438" strokeWidth="1" opacity="0.55" />
            <path d="M60 84 Q60 130 60 180" stroke="#564438" strokeWidth="1" opacity="0.55" />
            <path d="M78 84 Q81 120 84 162" stroke="#564438" strokeWidth="1" opacity="0.55" />
            <circle cx="40.5" cy="108" r="2.4" fill="#c4a484" />
            <circle cx="38.5" cy="130" r="1.9" fill="#564438" />
            <circle cx="37" cy="148" r="1.6" fill="#c4a484" />
            <circle cx="60" cy="112" r="2.6" fill="#564438" />
            <circle cx="60" cy="136" r="2.1" fill="#c4a484" />
            <circle cx="60" cy="158" r="1.7" fill="#564438" />
            <circle cx="79.5" cy="108" r="2.4" fill="#c4a484" />
            <circle cx="81.5" cy="130" r="1.9" fill="#564438" />
            <circle cx="83" cy="148" r="1.6" fill="#c4a484" />
            <g opacity="0.92">
              <path d="M36 162 C24 172, 18 192, 26 208 C34 198, 38 178, 36 162Z" fill="#564438" opacity="0.78" />
              <path d="M36 162 C31 176, 28 192, 30 206" stroke="#e8d5c4" strokeWidth="0.65" opacity="0.7" />
              <path d="M60 180 C50 190, 44 212, 54 218 C64 208, 68 194, 60 180Z" fill="#46362c" opacity="0.82" />
              <path d="M60 180 C57 194, 54 208, 56 216" stroke="#e8d5c4" strokeWidth="0.7" opacity="0.7" />
              <path d="M84 162 C96 172, 102 192, 94 208 C86 198, 82 178, 84 162Z" fill="#564438" opacity="0.78" />
              <path d="M84 162 C89 176, 92 192, 90 206" stroke="#e8d5c4" strokeWidth="0.65" opacity="0.7" />
            </g>
          </svg>
          {!dragging && (
            <span className="pointer-events-none absolute -bottom-1 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[8px] tracking-[0.18em] text-burgundy/45 uppercase sm:block">
              Drag me
            </span>
          )}
        </div>
      </div>
    </aside>
  )
}
