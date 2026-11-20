import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HERO_SUPPORT } from '../lib/heroAssets'
import { whatsappLink } from '../lib/whatsapp'

const steps = [
  { n: '01', title: 'Choose', text: 'Pick a dress from the edit, or send a photo of the look you want.' },
  { n: '02', title: 'Measure', text: 'Share bust, waist, and hip on WhatsApp. We cut to those numbers.' },
  { n: '03', title: 'Stitch', text: 'The piece is finished in about 15 days and ready to collect or ship.' },
]

function StitchNote() {
  const [note, setNote] = useState('')
  const href = whatsappLink(
    `Hi Ajitha Collection, I would like a custom stitch.${note.trim() ? ` ${note.trim()}` : ''} I will send a reference photo in this chat.`,
  )
  return (
    <div id="stitch" className="mx-auto mt-6 max-w-7xl border border-beige bg-white px-5 py-6">
      <p className="eyebrow">Custom stitching</p>
      <h2 className="display-title max-w-xl">Your design. Our craftsmanship.</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Describe the outfit. WhatsApp opens with your note. Send the reference photo in that chat.
      </p>
      <form
        className="mt-4 max-w-xl"
        onSubmit={(event) => {
          event.preventDefault()
          window.open(href, '_blank', 'noopener,noreferrer')
        }}
      >
        <label className="block text-xs text-muted" htmlFor="stitch-note">
          What should we stitch?
          <textarea
            id="stitch-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            className="mt-1 w-full border border-beige px-3 py-2 text-sm text-ink"
            placeholder="Neckline, fabric, colour, and the dress you want it based on."
          />
        </label>
        <button type="submit" className="btn mt-3">
          Continue on WhatsApp
        </button>
      </form>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="px-4 py-6 sm:px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-6 overflow-hidden rounded-[20px] border border-beige bg-ivory md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative h-56 sm:h-72 md:h-full md:min-h-[420px]">
          <img
            src={HERO_SUPPORT.three}
            alt="A dress from the Ajitha atelier"
            className="h-full w-full object-cover object-top"
          />
        </div>
        <div className="px-5 pb-6 md:py-8 md:pr-8 md:pl-2">
          <p className="eyebrow">The making</p>
          <h2 className="display-title max-w-md">
            Not stitched for a rack. Stitched for you.
          </h2>
          <ol className="mt-5 space-y-3">
            {steps.map((step) => (
              <li key={step.n} className="flex gap-3">
                <span className="price w-8 shrink-0 pt-0.5 text-sm">{step.n}</span>
                <div>
                  <p className="font-display text-xl text-ink">{step.title}</p>
                  <p className="text-sm leading-relaxed text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/products" className="btn mt-5 inline-flex">
            Browse the edit
          </Link>
        </div>
      </div>
      <StitchNote />
    </section>
  )
}
