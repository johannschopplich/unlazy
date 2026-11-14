import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],

  compatibilityDate: '2026-01-01',

  vite: {
    resolve: {
      alias: {
        'unlazy': fileURLToPath(new URL('../../unlazy/src/', import.meta.url)),
        '@unlazy/vue/components': fileURLToPath(new URL('../../vue/src/components/index.ts', import.meta.url)),
      },
    },

    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'fast-blurhash',
        'thumbhash',
      ],
    },
  },

  imports: {
    autoImport: false,
  },
})
