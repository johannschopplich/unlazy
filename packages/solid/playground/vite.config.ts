import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

const currentDir = new URL('.', import.meta.url).pathname

export default defineConfig({
  // @ts-expect-error: Vite 5 support pending
  plugins: [solid()],

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
