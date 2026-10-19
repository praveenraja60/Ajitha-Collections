import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { easeLuxury, view } from '../lib/motion'

export default function StudioStrip() {
  return (
    <section className="content-auto px-4 py-3.5 sm:px-6 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.28, ease: easeLuxury }}
        className="mx-auto max-w-7xl"
      >
        <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-r from-wine via-burgundy to-rose px-5 py-5 text-ivory sm:px-8 sm:py-6">
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-gold/90">The boutique</p>
              <p className="mt-1.5 max-w-xl font-sans text-xl leading-snug text-ivory sm:text-2xl">
                Dresses designed around you — browse, choose, order.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-[10px] border border-gold/50 bg-gold/95 px-6 text-[12px] font-semibold tracking-[0.1em] text-wine uppercase transition hover:bg-ivory"
            >
              Shop the edit
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
