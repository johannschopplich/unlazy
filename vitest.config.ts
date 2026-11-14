import type { BrowserConfigOptions } from 'vitest/node'
import { fileURLToPath } from 'node:url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'
import { imageServer } from './packages/unlazy/test/imageServer'

// Each project needs its own `browser` object.
function chromium(): BrowserConfigOptions {
  return {
    enabled: true,
    provider: playwright(),
    headless: true,
    instances: [
      { browser: 'chromium' },
    ],
  }
}

// Adapter tests run against the `unlazy` source, so they need no build first.
// `resolve.tsconfigPaths` misses Svelte, whose tsconfig extends SvelteKit's without the `unlazy` path.
const unlazySource = [
  {
    find: /^unlazy$/,
    replacement: fileURLToPath(new URL('./packages/unlazy/src/index.ts', import.meta.url)),
  },
]

const adapters = [
  {
    name: 'react',
    plugin: react(),
    setupFiles: ['test/setup.ts'],
  },
  {
    name: 'vue',
    plugin: vue(),
  },
  {
    name: 'solid',
    plugin: solid(),
  },
  {
    name: 'svelte',
    plugin: svelte(),
  },
]

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          include: ['packages/unlazy/test/**/*.test.ts', 'packages/{react,solid}/test/build.test.ts'],
          exclude: ['packages/unlazy/test/**/*.browser.test.ts'],
        },
      },
      {
        plugins: [
          imageServer(),
        ],
        test: {
          name: 'browser',
          include: ['packages/unlazy/test/**/*.browser.test.ts'],
          browser: chromium(),
        },
      },
      ...adapters.map(({ name, plugin, setupFiles }) => ({
        plugins: [
          imageServer(),
          plugin,
        ],
        root: `packages/${name}`,
        resolve: {
          alias: unlazySource,
        },
        test: {
          name: `browser:${name}`,
          include: ['test/**/*.test.{ts,tsx}'],
          exclude: ['test/build.test.ts'],
          setupFiles,
          browser: chromium(),
        },
      })),
    ],
  },
})
