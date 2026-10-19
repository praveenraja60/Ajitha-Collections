import { motion } from 'framer-motion'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, WHATSAPP_DISPLAY, whatsappLink } from '../lib/whatsapp'
import { HERO_SUPPORT } from '../lib/heroAssets'
import { easeLuxury, imageZoom, view } from '../lib/motion'

export default function Contact() {
  return (
    <section id="contact" className="content-auto px-4 py-4 sm:px-6 sm:py-5">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={view}
        transition={{ duration: 0.3, ease: easeLuxury }}
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[14px] border border-beige bg-ivory/85 md:grid-cols-2"
      >
        <div className="overflow-hidden">
          <motion.img
            src={HERO_SUPPORT.four}
            alt="Ajitha Collection studio"
            initial="hidden"
            whileInView="show"
            viewport={view}
            variants={imageZoom}
            className="h-40 w-full object-cover object-top md:h-full md:min-h-[200px] md:max-h-[240px]"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-6 sm:px-8">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-1 text-[1.9rem] sm:text-[2.4rem]">Let’s create your outfit</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Share a reference on WhatsApp or Instagram — we’ll help with fabric, fitting and custom stitching.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <motion.a
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              className="btn"
              whileTap={{ scale: 0.98 }}
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </motion.a>
            <motion.a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              whileTap={{ scale: 0.98 }}
            >
              {INSTAGRAM_HANDLE}
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
