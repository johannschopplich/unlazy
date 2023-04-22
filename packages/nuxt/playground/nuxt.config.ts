export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '../src/module'],

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
