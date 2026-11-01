import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

const currentDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      preprocess: vitePreprocess(),
    }),
  ],

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
