import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CATEGORIES } from '../data/productInfo'
import { categoryCover } from '../lib/catalog'
import { easeLuxury, fadeScale, imageZoom, stagger, view } from '../lib/motion'
import { useFinePointer } from '../hooks/useFinePointer'
import Reveal from './Reveal'

export default function FeaturedCollections() {
  const fine = useFinePointer()

  return (
    <section className="px-4 py-7 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <Reveal className="mb-5 text-center">
          <p className="eyebrow">Browse</p>
          <h2 className="section-title mt-2 font-sans text-[1.85rem] sm:text-[2.15rem]">Shop by category</h2>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3"
        >
          {CATEGORIES.map((cat) => {
            const cover = categoryCover(cat)
            return (
              <motion.div
                key={cat}
                variants={fadeScale}
                whileHover={fine ? { y: -4 } : undefined}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: easeLuxury }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  className="group relative block overflow-hidden rounded-[10px] bg-cream"
                >
                  {cover ? (
                    <motion.img
                      src={cover.main.src}
                      alt={cat}
                      variants={imageZoom}
                      className="aspect-[3/4] w-full object-cover object-top transition duration-700 group-hover:scale-[1.06] group-active:scale-[1.04]"
                    />
                  ) : (
                    <div className="aspect-[3/4] bg-cream" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/35 to-transparent px-3 pt-10 pb-4 text-center">
                    <span className="font-sans text-xl text-ivory">{cat}</span>
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
