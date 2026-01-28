// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: false,
  react: true,
})
  .append({
    files: ['**/playground/**'],
    rules: {
      'no-console': 'off',
    },
  })
