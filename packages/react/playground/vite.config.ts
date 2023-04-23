import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  plugins: [react()],

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
