// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
  solid: true,
})
  .append({
    files: ['**/playground/**'],
    rules: {
      'no-console': 'off',
    },
  })
