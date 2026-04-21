import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  outExtensions: ({ format }) =>
    format === 'es'
      ? { js: '.js', dts: '.d.ts' }
      : { js: '.cjs', dts: '.d.cts' },
})
