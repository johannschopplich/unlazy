import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/thumbhash',
    './src/blurhash',
  ],
  declaration: true,
  clean: true,
})
