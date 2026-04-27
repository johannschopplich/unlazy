import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  modules: ['../src/module'],

  compatibilityDate: '2026-01-01',

  vite: {
    resolve: {
      alias: {
        '@unlazy/core': `${resolve(currentDir, '../../core/src')}/`,
        'unlazy': `${resolve(currentDir, '../../unlazy/src')}/`,
      },
    },

    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'fast-blurhash',
        'thumbhash',
      ],

      exclude: [
        '@unlazy/core',
        'unlazy',
      ],
    },
  },

  imports: {
    autoImport: false,
  },
})
