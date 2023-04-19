import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const currentDir = new URL('.', import.meta.url).pathname

// Only build the IIFE format for the browser
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(currentDir, 'src/index.iife.ts'),
      name: 'UnLazy',
      formats: ['es', 'iife'],
    },
  },
})
