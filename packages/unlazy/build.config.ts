import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/thumbhash',
    './src/blurhash',
  ],
  rollup: {
    emitCJS: true,
  },
  declaration: true,
  clean: true,
})
