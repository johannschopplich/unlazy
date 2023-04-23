import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  plugins: [react()],

  // Custom alias for unlazy until Jiti issue is resolved
  // https://github.com/unjs/jiti/issues/136
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
