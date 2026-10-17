import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Plugin } from 'vite'

function resolveImagesDir(root: string) {
  const pub = join(root, 'public')
  if (!existsSync(pub)) return null
  const match = readdirSync(pub, { withFileTypes: true }).find(
    (d) => d.isDirectory() && d.name.toLowerCase() === 'images',
  )
  if (!match) return null
  return { abs: join(pub, match.name), urlBase: match.name }
}

function emit(root: string) {
  const found = resolveImagesDir(root)
  const dirName = found?.urlBase ?? 'Images'
  const files = found
    ? readdirSync(found.abs).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !f.startsWith('.'))
    : []
  files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  const hero = files.find((f) => /hero/i.test(f)) ?? null
  const out = join(root, 'src', 'data', 'imageFiles.generated.ts')
  const next = `/* Auto-generated from public/${dirName}. Do not edit. */
export const IMAGE_BASE = '/${dirName}'
export const HERO_FILE: string | null = ${hero ? JSON.stringify(hero) : 'null'}
export const IMAGE_FILES: string[] = ${JSON.stringify(files, null, 2)}
`
  if (existsSync(out) && readFileSync(out, 'utf8') === next) return
  writeFileSync(out, next)
}

export function imageCatalogPlugin(root: string): Plugin {
  return {
    name: 'image-catalog',
    apply: 'build',
    buildStart() {
      emit(root)
    },
  }
}
