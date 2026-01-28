// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu()
  .append({
    files: ['**/playground/**'],
    rules: {
      'no-console': 'off',
    },
  })
