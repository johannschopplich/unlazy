import antfu, { react, solid } from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  ignores: ['**/.svelte-kit/**'],
})
  .append(react({ files: ['packages/react/**/*.?([cm])[jt]s?(x)'] }))
  .append(solid({ files: ['packages/solid/**/*.?([cm])[jt]s?(x)'] }))
  .append({
    files: ['packages/*/playground/**', 'packages/svelte/src/routes/**'],
    rules: {
      'no-console': 'off',
    },
  })
