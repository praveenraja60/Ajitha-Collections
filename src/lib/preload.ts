const ready = new Set<string>()

export function preloadSrc(src: string) {
  if (ready.has(src)) return
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  img.decode?.().catch(() => {})
  ready.add(src)
}

export function preloadMany(srcs: string[]) {
  srcs.forEach(preloadSrc)
}
