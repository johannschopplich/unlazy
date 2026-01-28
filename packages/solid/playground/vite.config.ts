import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [solid()],

  resolve: {
    alias: {
      '@unlazy/core': `${resolve(currentDir, '../../core/src')}/`,
      'unlazy': `${resolve(currentDir, '../../unlazy/src')}/`,
    },
  },

  optimizeDeps: {
    exclude: [
      '@unlazy/core',
      'unlazy',
    ],
  },
})
