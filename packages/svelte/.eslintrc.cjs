module.exports = {
  extends: ['@antfu/eslint-config-ts'],
  plugins: ['svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  // Disable some conflicting `@antfu/eslint-config-ts` rules
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    'import/first': 'off',
    'import/no-mutable-exports': 'off',
    'no-multiple-empty-lines': 'off',
    'no-undef-init': 'off',
  },
}
