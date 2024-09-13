import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

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
