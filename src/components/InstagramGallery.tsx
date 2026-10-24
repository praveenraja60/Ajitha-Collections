import { motion } from 'framer-motion'
import { products } from '../lib/catalog'
import { HERO_SUPPORT } from '../lib/heroAssets'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from '../lib/whatsapp'
import InstagramGlyph from './InstagramGlyph'
import Reveal from './Reveal'
import { fadeScale, imageZoom, stagger, view } from '../lib/motion'

const posts = [
  { src: products[0]?.main.src, alt: products[0]?.name ?? 'Ajitha Collection' },
  { src: HERO_SUPPORT.three, alt: 'Atelier look' },
  { src: products[2]?.main.src, alt: products[2]?.name ?? 'Ajitha Collection' },
  { src: HERO_SUPPORT.five, alt: 'Studio styling' },
  { src: products[5]?.main.src, alt: products[5]?.name ?? 'Ajitha Collection' },
  { src: HERO_SUPPORT.four, alt: 'Boutique studio' },
].filter((p): p is { src: string; alt: string } => Boolean(p.src))

export default function InstagramGallery() {
  return (
    <section className="content-auto px-4 py-4 sm:px-6 sm:py-5">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Studio</p>
            <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">On Instagram</h2>
          </div>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="text-[11px] tracking-[0.2em] text-burgundy uppercase">
            {INSTAGRAM_HANDLE}
          </a>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={view}
          className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6"
        >
          {posts.map((post) => (
            <motion.a
              key={post.src}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              variants={fadeScale}
              className="group relative aspect-square overflow-hidden rounded-[10px] bg-cream"
            >
              <motion.img
                src={post.src}
                alt={post.alt}
                variants={imageZoom}
                className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-110 group-active:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-wine/50 text-champagne opacity-0 transition duration-500 group-hover:opacity-100 group-active:opacity-100">
                <InstagramGlyph className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
