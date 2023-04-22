import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/formats/blurhash',
    './src/formats/thumbhash',
  ],
  declaration: true,
  clean: true,
})
