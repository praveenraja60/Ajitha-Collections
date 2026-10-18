import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Dreamcatcher with elastic pull + correct left/right direction.
 * Drag right → swings right. Pull stretches like elastic, then springs back.
 */

const MAX_ANGLE = 0.85
const GRAVITY = 11
const LENGTH = 1.35
const DAMPING = 0.988
const SPRING = 18 // elastic return strength
const IDLE_AMP = 0.03
const IDLE_SPEED = 0.3

export default function DreamcatcherCharm() {
  const reduce = useReducedMotion()
  const rootRef = useRef<HTMLElement>(null)
  const pivotRef = useRef<HTMLDivElement>(null)
  const swingRef = useRef<HTMLDivElement>(null)
  const stretchRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const velRef = useRef(0)
  const stretchRefN = useRef(0)
  const stretchVelRef = useRef(0)
  const targetAngleRef = useRef(0)
  const draggingRef = useRef(false)
  const pointerIdRef = useRef<number | null>(null)
  const lastTRef = useRef(0)
  const lastARef = useRef(0)
  const idleTRef = useRef(0)
  const visibleRef = useRef(true)
  const [dragging, setDragging] = useState(false)

  const paint = useCallback((angle: number, stretch = stretchRefN.current) => {
    angleRef.current = angle
    stretchRefN.current = stretch
    const swing = swingRef.current
    const cord = stretchRef.current
    if (swing) {
      // Negate so finger RIGHT → charm swings RIGHT (CSS clockwise vs screen coords)
      swing.style.transform = `rotate(${(-angle * 180) / Math.PI}deg)`
    }
    if (cord) {
      // Elastic stretch on the hanging cord
      const s = 1 + stretch * 0.22
      cord.style.transform = `scaleY(${s})`
    }
  }, [])

  /** Screen: +x right, +y down. Positive angle = pull to the RIGHT. */
  const pointerToAngle = useCallback((clientX: number, clientY: number) => {
    const pivot = pivotRef.current
    if (!pivot) return { angle: 0, stretch: 0 }
    const r = pivot.getBoundingClientRect()
    const px = r.left + r.width / 2
    const py = r.top + r.height / 2
    const dx = clientX - px
    const dy = Math.max(40, clientY - py)
    // atan2(dx, dy): +dx (right) → +angle
    const raw = Math.atan2(dx, dy)
    const angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, raw))
    // Extra pull past soft limit becomes elastic stretch (0..1)
    const dist = Math.hypot(dx, dy)
    const rest = 120
    const stretch = Math.max(0, Math.min(1.15, (dist - rest) / 140))
    return { angle, stretch }
  }, [])

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return
    draggingRef.current = false
    pointerIdRef.current = null
    setDragging(false)
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    // Keep throw velocity for elastic swing-out
    velRef.current = Math.max(-3.2, Math.min(3.2, velRef.current))
  }, [])

  useEffect(() => {
    const root = rootRef.current
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

      if (!visibleRef.current) {
        frame = requestAnimationFrame(tick)
        return
      }

      if (draggingRef.current) {
        // Elastic follow: spring toward finger (not hard lock)
        const target = targetAngleRef.current
        const diff = target - angleRef.current
        velRef.current = (velRef.current + diff * SPRING * dt) * 0.86
        const next = angleRef.current + velRef.current * dt
        // Stretch settles slightly toward pull stretch while dragging (set in move)
        paint(next, stretchRefN.current)
      } else {
        // Pendulum + spring to center when large
        const accel =
          (-GRAVITY / LENGTH) * Math.sin(angleRef.current) - angleRef.current * 1.2
        velRef.current = (velRef.current + accel * dt) * DAMPING

        // Elastic stretch springs back to 0
        stretchVelRef.current =
          (stretchVelRef.current + (0 - stretchRefN.current) * 22 * dt) * 0.9
        const nextStretch = Math.max(0, stretchRefN.current + stretchVelRef.current * dt)

        if (Math.abs(velRef.current) < 0.04 && Math.abs(angleRef.current) < 0.04 && nextStretch < 0.02) {
          idleTRef.current += dt
          paint(Math.sin(idleTRef.current * IDLE_SPEED) * IDLE_AMP, 0)
          stretchVelRef.current = 0
        } else {
          idleTRef.current = 0
          let next = angleRef.current + velRef.current * dt
          next = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, next))
          if (Math.abs(next) >= MAX_ANGLE) velRef.current *= -0.45
          paint(next, nextStretch)
          if (Math.abs(velRef.current) < 0.001 && Math.abs(next) < 0.001) velRef.current = 0
        }
      }

      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduce, paint])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return
      e.preventDefault()
      const now = performance.now()
      const { angle, stretch } = pointerToAngle(e.clientX, e.clientY)
      const dt = Math.max(0.012, (now - lastTRef.current) / 1000)
      velRef.current = (angle - lastARef.current) / dt
      lastARef.current = angle
      lastTRef.current = now
      targetAngleRef.current = angle
      stretchRefN.current = stretch
      stretchVelRef.current = 0
    }

    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return
      if (pointerIdRef.current != null && e.pointerId !== pointerIdRef.current) return
      endDrag()
    }

    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [endDrag, pointerToAngle])

  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (reduce) return
    e.preventDefault()
    e.stopPropagation()
    pointerIdRef.current = e.pointerId
    draggingRef.current = true
    setDragging(true)
    velRef.current = 0
    lastTRef.current = performance.now()
    const { angle, stretch } = pointerToAngle(e.clientX, e.clientY)
    lastARef.current = angle
    targetAngleRef.current = angle
    stretchRefN.current = stretch
    paint(angle, stretch)
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* ok */
    }
  }

  return (
    <aside
      ref={rootRef}
      className="dreamcatcher-charm fixed top-0 left-0 z-40 select-none sm:left-2 lg:left-3"
      aria-label="Dreamcatcher — pull to swing"
    >
      <div ref={pivotRef} className="absolute top-0 left-1/2 h-1 w-1 -translate-x-1/2" />

      <div ref={swingRef} className="origin-top will-change-transform" style={{ touchAction: 'none' }}>
        <div
          ref={stretchRef}
          className="relative mx-auto flex w-10 origin-top flex-col items-center will-change-transform"
        >
          <div className="h-16 w-[2px] rounded-full bg-gradient-to-b from-[#c4a484] via-[#564438] to-[#46362c] sm:h-20 lg:h-[5.5rem]" />
          <div className="absolute top-5 h-1.5 w-1.5 rounded-full bg-[#c4a484]" />
          <div className="absolute top-11 h-1 w-1 rounded-full bg-[#564438]/90" />
        </div>

        <button
          type="button"
          aria-label="Pull dreamcatcher"
          className={`dreamcatcher-charm__hit relative -mt-0.5 flex cursor-grab items-start justify-center border-0 bg-transparent p-0 active:cursor-grabbing ${
            dragging ? 'scale-[1.03]' : ''
          } transition-transform duration-150`}
          style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
          onPointerDown={onPointerDown}
        >
          <svg
            viewBox="0 0 120 220"
            className="h-[9.5rem] w-[5rem] drop-shadow-[0_10px_20px_rgba(70,54,44,0.22)] sm:h-[12rem] sm:w-[6.25rem] lg:h-[14rem] lg:w-[7.25rem]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
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
            <span className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] tracking-[0.16em] text-burgundy/50 uppercase">
              Pull
            </span>
          )}
        </button>
      </div>
    </aside>
  )
}
