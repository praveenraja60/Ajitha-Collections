import { motion } from 'framer-motion'
import { whatsappLink } from '../lib/whatsapp'
import { springSoft } from '../lib/motion'

export default function WhatsAppButton() {
  return (
    <motion.a
      href={whatsappLink('Hi Ajitha Collection, I would like to chat.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
      className="wa-fab flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_rgba(37,211,102,0.35)]"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...springSoft, delay: 0.15 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
        <path
          fill="currentColor"
          d="M20.5 3.5A11 11 0 0 0 2.2 16.5L1 22l5.7-1.2A11 11 0 0 0 20.5 3.5Zm-8.5 17a9.1 9.1 0 0 1-4.6-1.2l-.3-.2-3.4.7.7-3.3-.2-.3A9.1 9.1 0 1 1 12 20.5Zm5-6.8c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.4.1-.3c0-.1 0-.3 0-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3c.1.2 1.6 2.5 3.8 3.4 1.4.6 1.9.7 2.6.6.4 0 1.2-.5 1.4-1s.2-.9.1-1-.3-.2-.6-.3Z"
        />
      </svg>
    </motion.a>
  )
}
