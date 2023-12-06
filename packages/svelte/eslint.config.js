import sveltePlugin from 'eslint-plugin-svelte'
import * as svelteParser from 'svelte-eslint-parser'
import * as tsParser from '@typescript-eslint/parser'
import antfu from '@antfu/eslint-config'

export default await antfu(
  {
    vue: false,
    ignores: ['.svelte-kit', 'tsconfig.json'],
  },
  {
    files: ['**/*.svelte'],
    plugins: {
      svelte: sveltePlugin,
    },
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        parser: tsParser,
      },
    },
    rules: {
      ...sveltePlugin.configs.recommended.rules,
      'import/no-mutable-exports': 'off',
      'no-undef-init': 'off',
    },
  },
)
