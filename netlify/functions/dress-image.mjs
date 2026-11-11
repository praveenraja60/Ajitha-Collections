import { getStore } from '@netlify/blobs'

export default async (req) => {
  const url = new URL(req.url)
  const name = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '')
  if (!name || name.includes('..')) return new Response('Not found', { status: 404 })
  const blob = await getStore('ajitha-dresses').get(`images/${name}`, { type: 'arrayBuffer' })
  if (!blob) return new Response('Not found', { status: 404 })
  return new Response(blob, {
    headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000' },
  })
}
