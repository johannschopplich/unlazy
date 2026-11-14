import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const npmBase: UserConfig = {
  platform: 'neutral',
  // The neutral platform reads no main fields, but `thumbhash` ships only a
  // `main` field and must still be bundled.
  inputOptions: {
    resolve: {
      mainFields: ['module', 'main'],
    },
  },
}

const noLoggingDefine = { __UNLAZY_LOGGING__: 'false' }

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
    ...npmBase,
    entry: [
      './src/index.ts',
      './src/blurhash.ts',
      './src/thumbhash.ts',
    ],
    define: noLoggingDefine,
    clean: true,
  },
  // Only the main entry logs, so the hash entries have no development build,
  // and this one bundles its own copy of both decoders.
  {
    ...npmBase,
    entry: { 'index.development': './src/index.ts' },
    dts: false,
    clean: false,
  },
  {
    ...iifeBase,
    define: { ...noLoggingDefine, __UNLAZY_HASH_DECODING__: 'false' },
    outputOptions: { entryFileNames: 'unlazy.iife.js' },
  },
  {
    ...iifeBase,
    define: { ...noLoggingDefine, __UNLAZY_HASH_DECODING__: 'true' },
    outputOptions: { entryFileNames: 'unlazy.with-hashing.iife.js' },
  },
  {
    ...esmBundleBase,
    define: { ...noLoggingDefine, __UNLAZY_HASH_DECODING__: 'false' },
    outputOptions: { entryFileNames: 'unlazy.js' },
  },
  {
    ...esmBundleBase,
    define: { ...noLoggingDefine, __UNLAZY_HASH_DECODING__: 'true' },
    outputOptions: { entryFileNames: 'unlazy.with-hashing.js' },
  },
])
