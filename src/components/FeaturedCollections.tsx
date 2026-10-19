import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../data/productInfo'
import { categoryCover } from '../lib/catalog'
import { easeLuxury, fadeScale, imageZoom, stagger, view } from '../lib/motion'
import Reveal from './Reveal'

export default function FeaturedCollections() {
  return (
    <section className="content-auto px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-3.5 text-center">
          <p className="eyebrow">Browse</p>
          <h2 className="section-title mt-1.5 text-[2rem] sm:text-[2.35rem]">Shop by category</h2>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2.5"
        >
          {CATEGORIES.map((cat) => {
            const cover = categoryCover(cat)
            return (
              <motion.div
                key={cat}
                variants={fadeScale}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: easeLuxury }}
                className="transition-transform duration-200 hover:-translate-y-1"
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="group relative block overflow-hidden rounded-[10px] bg-cream"
                >
                  {cover ? (
                    <motion.img
                      src={cover.main.src}
                      alt={cat}
                      loading="lazy"
                      decoding="async"
                      variants={imageZoom}
                      className="aspect-[3/4] w-full object-cover object-top transition duration-500 group-hover:scale-[1.05] group-active:scale-[1.03]"
                    />
                  ) : (
                    <div className="aspect-[3/4] bg-cream" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-3 pt-8 pb-3.5 text-center">
                    <span className="font-sans text-lg text-ivory sm:text-xl">{cat}</span>
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
