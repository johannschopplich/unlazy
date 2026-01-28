import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [sveltekit()],

  resolve: {
    alias: {
      '@unlazy/core': `${resolve(currentDir, '../core/src')}/`,
      'unlazy': `${resolve(currentDir, '../unlazy/src')}/`,
    },
  },

  optimizeDeps: {
    exclude: [
      '@unlazy/core',
      'unlazy',
    ],
  },
})
