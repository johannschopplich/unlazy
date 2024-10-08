// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: false,
    svelte: true,
    ignores: ['.svelte-kit'],
  },
  {
    files: ['**/*.svelte'],
    rules: {
      'no-undef-init': 'off',
    },
  },
)
