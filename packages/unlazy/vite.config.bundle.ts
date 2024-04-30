import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(currentDir, 'src/bundle/index.iife.ts'),
      name: 'UnLazy',
      formats: ['es', 'iife'],
    },
  },
  define: {
    __UNLAZY_HASH_DECODING__: false,
  },
})
