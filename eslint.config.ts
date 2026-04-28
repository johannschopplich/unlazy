import antfu, { react, solid } from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  ignores: ['**/.svelte-kit/**'],
})
  .append(react({ files: ['packages/react/**/*.{ts,tsx}'] }))
  .append(solid({ files: ['packages/solid/**/*.{ts,tsx}'] }))
  .append({
    rules: {
      'no-console': 'off',
    },
  })
