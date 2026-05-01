import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const iifeBase: UserConfig = {
  entry: './src/bundle/index.iife.ts',
  format: 'iife',
  globalName: 'UnLazy',
  platform: 'browser',
  minify: true,
  clean: false,
}

const esmBundleBase: UserConfig = {
  entry: './src/bundle/index.iife.ts',
  format: 'esm',
  platform: 'browser',
  minify: true,
  clean: false,
  dts: false,
}

export default defineConfig([
  {
    entry: [
      './src/index.ts',
      './src/blurhash.ts',
      './src/thumbhash.ts',
    ],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    outExtensions: ({ format }) =>
      format === 'es'
        ? { js: '.js', dts: '.d.ts' }
        : { js: '.cjs', dts: '.d.cts' },
  },
  {
    ...iifeBase,
    define: { __UNLAZY_HASH_DECODING__: 'false' },
    outputOptions: { entryFileNames: 'unlazy.iife.js' },
  },
  {
    ...iifeBase,
    define: { __UNLAZY_HASH_DECODING__: 'true' },
    outputOptions: { entryFileNames: 'unlazy.with-hashing.iife.js' },
  },
  {
    ...esmBundleBase,
    define: { __UNLAZY_HASH_DECODING__: 'false' },
    outputOptions: { entryFileNames: 'unlazy.js' },
  },
  {
    ...esmBundleBase,
    define: { __UNLAZY_HASH_DECODING__: 'true' },
    outputOptions: { entryFileNames: 'unlazy.with-hashing.js' },
  },
])
