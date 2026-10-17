import { useEffect, useState } from 'react'

/** True when the device primarily uses a mouse / trackpad (hover-capable). */
export function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return fine
}
