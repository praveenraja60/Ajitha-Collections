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
        <div className="relative overflow-hidden rounded-[14px] border border-burgundy/20 bg-gradient-to-r from-wine via-burgundy to-rose px-5 py-5 text-champagne sm:px-8 sm:py-6">
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] tracking-[0.32em] uppercase text-gold">The boutique</p>
              <p className="mt-1.5 max-w-xl font-display text-2xl leading-snug text-champagne sm:text-[1.85rem]">
                Dresses designed around you — browse, choose, order.
              </p>
            </div>
            <Link to="/products" className="btn shrink-0">
              Shop the edit
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
