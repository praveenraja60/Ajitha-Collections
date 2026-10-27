import { motion } from 'framer-motion'
import { HERO_SUPPORT } from '../lib/heroAssets'
import { easeLuxury, fadeUp, imageZoom, stagger, view } from '../lib/motion'

const quotes = [
  { line: 'Your style. Your design. Our craft.', note: 'Every silhouette begins with you.' },
  { line: 'Made to be worn, remembered, and loved.', note: 'Stitched with care.' },
]

export default function About() {
  return (
    <section id="about" className="content-auto px-4 py-5 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 0.3, ease: easeLuxury }}
        >
          <p className="eyebrow">Atelier</p>
          <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Crafted With Passion</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Custom women’s fashion from your preferred design — fabric, fit and finishing handled with care.
          </p>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={view} className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {quotes.map((quote) => (
              <motion.blockquote key={quote.line} variants={fadeUp} className="rounded-[12px] border border-beige bg-ivory/80 px-4 py-3.5">
                <p className="font-sans text-lg italic text-ink sm:text-xl">“{quote.line}”</p>
                <footer className="mt-1.5 text-[10px] tracking-[0.18em] text-burgundy uppercase">{quote.note}</footer>
              </motion.blockquote>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 gap-2.5"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
        >
          <div className="overflow-hidden rounded-[10px]">
            <motion.img src={HERO_SUPPORT.three} alt="" variants={imageZoom} className="h-36 w-full object-cover object-top sm:h-48" />
          </div>
          <div className="mt-5 overflow-hidden rounded-[10px]">
            <motion.img src={HERO_SUPPORT.five} alt="" variants={imageZoom} className="h-36 w-full object-cover object-top sm:h-48" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
