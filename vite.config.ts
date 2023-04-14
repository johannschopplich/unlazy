import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // minify: false,
    // target: 'esnext',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'unlazy',
      formats: ['es', 'umd', 'iife'],
    },
  },
})
