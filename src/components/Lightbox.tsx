import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import type { CatalogImage } from '../lib/catalog'

type Props = {
  images: CatalogImage[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

export default function Lightbox({ images, index, onIndex, onClose }: Props) {
  const [zoom, setZoom] = useState(false)
  const [touchX, setTouchX] = useState<number | null>(null)
  const current = images[index]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [index, images.length, onClose, onIndex])

  if (!current) return null

  function swipeEnd(x: number) {
    if (touchX == null) return
    const dx = x - touchX
    if (dx < -40) onIndex((index + 1) % images.length)
    if (dx > 40) onIndex((index - 1 + images.length) % images.length)
    setTouchX(null)
  }

  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-plum/95" role="dialog" aria-modal="true" aria-label="Image viewer">
      <div className="flex items-center justify-between px-4 py-3 text-champagne">
        <p className="text-sm tracking-wide">{current.label} · {index + 1} / {images.length}</p>
        <div className="flex gap-1">
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label={zoom ? 'Zoom out' : 'Zoom in'} onClick={() => setZoom((z) => !z)}>
            {zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button type="button" className="rounded-full p-2 hover:bg-white/10" aria-label="Close" onClick={onClose}>
            <X size={22} />
          </button>
        </div>
      </div>
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-12"
        onTouchStart={(e) => setTouchX(e.changedTouches[0].clientX)}
        onTouchEnd={(e) => swipeEnd(e.changedTouches[0].clientX)}
      >
        <button
          type="button"
          className="absolute left-2 rounded-full bg-white/10 p-2 text-white sm:left-4"
          aria-label="Previous image"
          onClick={() => onIndex((index - 1 + images.length) % images.length)}
        >
          <ChevronLeft />
        </button>
        <img
          src={current.src}
          alt={`View ${current.label}`}
          className={`max-h-full max-w-full object-contain transition duration-300 ${zoom ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={() => setZoom((z) => !z)}
        />
        <button
          type="button"
          className="absolute right-2 rounded-full bg-white/10 p-2 text-white sm:right-4"
          aria-label="Next image"
          onClick={() => onIndex((index + 1) % images.length)}
        >
          <ChevronRight />
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => onIndex(i)}
            className={`relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${i === index ? 'border-burgundy' : 'border-transparent'}`}
            aria-label={img.label}
          >
            <img src={img.src} alt={img.label} width={56} height={72} decoding="async" className="h-full w-full object-cover object-top" />
            <span className="absolute bottom-0 inset-x-0 bg-black/55 text-center text-[9px] text-white">{img.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
