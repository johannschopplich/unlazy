import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/blurhash',
  ],
  declaration: true,
  clean: true,
})
