// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
  svelte: true,
  ignores: ['.svelte-kit'],
})
  .append({
    files: ['**/routes/**'],
    rules: {
      'no-console': 'off',
    },
  })
