import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@unlazy/core': `${resolve(currentDir, '../../core/src')}/`,
      'unlazy': `${resolve(currentDir, '../../unlazy/src')}/`,
    },
  },
  optimizeDeps: {
    exclude: [
      'unlazy',
      '@unlazy/core',
    ],
  },
})
