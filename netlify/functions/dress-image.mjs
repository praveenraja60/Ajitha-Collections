import { getStore } from '@netlify/blobs'

function store(context) {
  if (context?.blobs?.getStore) return context.blobs.getStore('ajitha-dresses')
  return getStore('ajitha-dresses')
}

export default async (req, context) => {
  const url = new URL(req.url)
  const name = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() ?? '')
  if (!name || name.includes('..')) return new Response('Not found', { status: 404 })
  const blob = await store(context).get(`images/${name}`, { type: 'arrayBuffer' })
  if (!blob) return new Response('Not found', { status: 404 })
  return new Response(blob, {
    headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000' },
  })
}

export const config = {
  path: '/dress-images/*',
}
