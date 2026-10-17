import { motion, useReducedMotion } from 'framer-motion'
import { easeLuxury } from '../lib/motion'
import type { ReactNode } from 'react'

export default function Reveal({
  children,
  className = '',
  delay = 0,
  y = 14,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -6% 0px', amount: 0.05 }}
      transition={{ duration: 0.28, delay, ease: easeLuxury }}
    >
      {children}
    </motion.div>
  )
}
