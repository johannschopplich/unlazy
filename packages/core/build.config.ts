import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/blurhash',
    './src/thumbhash',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  declaration: true,
  clean: true,
})
