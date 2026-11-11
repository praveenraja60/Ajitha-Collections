import { getStore } from '@netlify/blobs'

const STORE = 'ajitha-dresses'
const CATALOG = 'catalog'

function store(context) {
  if (context?.blobs?.getStore) return context.blobs.getStore(STORE)
  return getStore(STORE)
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export default async (req, context) => {
  const url = new URL(req.url)
  const blobs = store(context)

  if (url.pathname.endsWith('/image') && req.method === 'POST') {
    const body = await req.json()
    const match = String(body.dataUrl ?? '').match(/^data:image\/[^;]+;base64,(.+)$/)
    if (!match) return json({ error: 'Image required' }, 400)
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    await blobs.set(`images/${id}`, Buffer.from(match[1], 'base64'), {
      metadata: { contentType: 'image/jpeg' },
    })
    return json({ id, url: `/dress-images/${id}` })
  }

  if (req.method === 'GET') {
    const raw = await blobs.get(CATALOG, { type: 'text' })
    const parsed = raw ? JSON.parse(raw) : { dresses: [] }
    return json({ dresses: Array.isArray(parsed.dresses) ? parsed.dresses : [] })
  }

  if (req.method === 'PUT') {
    const body = await req.json()
    const dresses = Array.isArray(body.dresses) ? body.dresses : []
    await blobs.set(CATALOG, JSON.stringify({ dresses }))
    return json({ dresses })
  }

  return json({ error: 'Method not allowed' }, 405)
}

export const config = {
  path: ['/api/dresses', '/api/dresses/*'],
}
