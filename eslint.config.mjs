// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu()
  .append({
    rules: {
      'no-console': 'off',
    },
  })
