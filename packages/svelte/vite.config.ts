import { fileURLToPath } from 'node:url'
import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      preprocess: vitePreprocess(),
    }),
  ],

  resolve: {
    alias: {
      unlazy: fileURLToPath(new URL('../unlazy/src/', import.meta.url)),
    },
  },
})
