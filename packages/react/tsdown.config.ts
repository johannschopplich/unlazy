import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.tsx'],
  platform: 'neutral',
  clean: true,
  // Rolldown may drop a module-level directive from the source.
  banner: {
    js: '\'use client\'',
  },
})
