/** Snappy easing — premium feel without waiting. */
export const easeLuxury = [0.22, 1, 0.36, 1] as const
export const easeSoft = [0.4, 0, 0.2, 1] as const
export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSoft = { type: 'spring' as const, stiffness: 480, damping: 36, mass: 0.7 }
export const springSnappy = { type: 'spring' as const, stiffness: 560, damping: 34, mass: 0.6 }

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeLuxury },
  },
}

export const fadeScale = {
  hidden: { opacity: 0, y: 10, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: easeLuxury },
  },
}

export const imageZoom = {
  hidden: { scale: 1.04 },
  show: {
    scale: 1,
    transition: { duration: 0.4, ease: easeLuxury },
  },
}

export const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03, delayChildren: 0 },
  },
}

export const staggerFast = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.02, delayChildren: 0 },
  },
}

/** Reveal content as soon as it enters the viewport. */
export const view = { once: true, margin: '0px 0px -8% 0px' as const, amount: 0.05 as const }

export const pageEnter = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.18, ease: easeLuxury },
}
