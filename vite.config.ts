import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { imageCatalogPlugin } from './vite-plugin-image-catalog.ts'

export default defineConfig({
  plugins: [react(), tailwindcss(), imageCatalogPlugin(process.cwd())],
  server: {
    hmr: false,
    watch: {
      ignored: ['**/imageFiles.generated.ts'],
    },
  },
})
