import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    vue: false,
    svelte: true,
    ignores: ['.svelte-kit', 'tsconfig.json'],
  },
  {
    files: ['**/*.svelte'],
    rules: {
      'no-undef-init': 'off',
    },
  },
)
