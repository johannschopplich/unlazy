import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/blurhash',
    './src/thumbhash',
  ],
  declaration: true,
  clean: true,
})
