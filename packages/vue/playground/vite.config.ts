import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  plugins: [vue()],

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
