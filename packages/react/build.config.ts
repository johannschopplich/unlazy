import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  externals: ['react', 'react-dom'],
  rollup: {
    emitCJS: true,
    resolve: {
      extensions: ['.ts', '.tsx'],
    },
    esbuild: {
      jsx: 'automatic',
    },
  },
})
