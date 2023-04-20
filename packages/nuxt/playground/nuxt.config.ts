export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '../src/module'],

  unlazy: {
    blurhash: {
      ssr: true,
    },
  },

  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        paths: {
          '@unlazy/core': ['../../core/src/index.ts'],
          '@unlazy/core/*': ['../../core/src/*'],
          'unlazy': ['../../unlazy/src/index.ts'],
          'unlazy/*': ['../../unlazy/src/*'],
        },
      },
    },
  },
})
