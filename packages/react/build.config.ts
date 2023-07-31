import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      builder: 'mkdist',
      input: 'src',
      esbuild: {
        jsx: 'automatic',
      },
    },
  ],
  declaration: true,
  clean: true,
})
