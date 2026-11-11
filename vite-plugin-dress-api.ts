import type { Plugin } from 'vite'
import { createFileStore } from './server/dressStore.mjs'

function readBody(req: import('http').IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export function dressApiPlugin(root: string): Plugin {
  const store = createFileStore(root)
  return {
    name: 'dress-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        void handle(req, res, next)
      })
    },
  }

  function handle(req: import('http').IncomingMessage, res: import('http').ServerResponse, next: () => void) {
    void (async () => {
        const pathname = req.url?.split('?')[0]
        if (pathname !== '/api/dresses' && pathname !== '/api/dresses/image') {
          next()
          return
        }
        try {
          if (pathname === '/api/dresses' && req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ dresses: store.read() }))
            return
          }
          if (pathname === '/api/dresses' && req.method === 'PUT') {
            const body = JSON.parse(await readBody(req)) as { dresses?: unknown[] }
            const dresses = Array.isArray(body.dresses) ? body.dresses : []
            store.write(dresses)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ dresses }))
            return
          }
          if (pathname === '/api/dresses/image' && req.method === 'POST') {
            const body = JSON.parse(await readBody(req)) as { dataUrl?: string }
            const match = String(body.dataUrl ?? '').match(/^data:image\/[^;]+;base64,(.+)$/)
            if (!match) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Image required' }))
              return
            }
            const saved = store.saveImage(Buffer.from(match[1], 'base64'))
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(saved))
            return
          }
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Save failed' }))
        }
      })()
  }
}
