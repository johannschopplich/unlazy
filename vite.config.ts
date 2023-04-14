import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  build: {
    // minify: false,
    // target: 'esnext',
    lib: {
      entry: resolve(currentDir, 'src/index.ts'),
      name: 'unlazy',
      formats: ['es', 'umd', 'iife'],
    },
  },
})
