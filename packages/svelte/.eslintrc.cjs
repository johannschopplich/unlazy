module.exports = {
  extends: ['@antfu/eslint-config-ts', 'plugin:svelte/recommended'],
  parserOptions: {
    extraFileExtensions: ['.svelte'],
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  // Disable some conflicting `@antfu/eslint-config-ts` rules
  rules: {
    'import/no-mutable-exports': 'off',
    'no-undef-init': 'off',
  },
}
