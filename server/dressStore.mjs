import fs from 'node:fs'
import path from 'node:path'

export function createFileStore(root) {
  const dataFile = path.join(root, 'data', 'dresses.json')
  const imageDir = path.join(root, 'public', 'dress-images')

  function ensure() {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true })
    fs.mkdirSync(imageDir, { recursive: true })
    if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify({ dresses: [] }, null, 2))
  }

  return {
    read() {
      ensure()
      const parsed = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
      return Array.isArray(parsed.dresses) ? parsed.dresses : []
    },
    write(dresses) {
      ensure()
      fs.writeFileSync(dataFile, JSON.stringify({ dresses }, null, 2))
      return dresses
    },
    saveImage(buffer) {
      ensure()
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
      fs.writeFileSync(path.join(imageDir, id), buffer)
      return { id, url: `/dress-images/${id}` }
    },
  }
}
