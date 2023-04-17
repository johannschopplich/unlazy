export default defineNuxtConfig({
  modules: ['@unocss/nuxt', '@vueuse/nuxt'],

  typescript: {
    shim: false,
    tsConfig: {
      compilerOptions: {
        paths: {
          '@unlazy/core': ['../packages/core/src/index.ts'],
          '@unlazy/core/*': ['../packages/core/src/*'],
        },
      },
    },
  },
})
