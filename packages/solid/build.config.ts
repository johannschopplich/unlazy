import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
    esbuild: {
      jsxFactory: 'template',
    },
  },
})
