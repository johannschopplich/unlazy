import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '../src/module'],

  compatibilityDate: '2025-01-01',

  vite: {
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
  },

  imports: {
    autoImport: false,
  },
})
