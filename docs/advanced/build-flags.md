# Build Flags

unlazy uses build-time flags to enable tree-shaking of unused features, reducing bundle size. Bundlers replace these flags at build time, allowing dead code elimination for features your project doesn't use.

Common bundlers support the `define` option for setting build flags:

- [Vite](https://vitejs.dev/config/shared-options.html#define)
- [@rollup/plugin-replace](https://www.npmjs.com/package/@rollup/plugin-replace)
- [esbuild](https://esbuild.github.io/api/#define)

As an example, you can tree-shake the hash decoding algorithms in Vite by setting the `define` option in your `vite.config.ts` file:

```ts
// `vite.config.ts`
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    // Defaults to `true`
    __UNLAZY_HASH_DECODING__: false,
    // Defaults to `true`
    __UNLAZY_LOGGING__: false,
  },
})
```

## Disable Hash Decoding <Badge type="info" text="^0.10.0" />

unlazy includes [BlurHash](/placeholders/blurhash) and [ThumbHash](/placeholders/thumbhash) decoding algorithms (from `fast-blurhash` and `thumbhash` packages). If your project doesn't use hash-based placeholders, you can exclude these dependencies entirely:

- `__UNLAZY_HASH_DECODING__`: Set to `false` to tree-shake hash decoding code. Default is `true`.

When disabled, the bundler removes:
- BlurHash and ThumbHash decoding libraries
- Hash-related code paths in `lazyLoad()`
- Associated dependencies from the final bundle

::: warning
This flag only affects the main entry point. If you directly import `unlazy/blurhash` or `unlazy/thumbhash`, those modules will still be bundled regardless of this flag.
:::

## Disable Client Logging <Badge type="info" text="^0.10.2" />

unlazy will help you locate missing `data-src` or `data-srcset` attributes in your project by logging a warning in the browser console. An example warning message looks like this:

```
[unlazy] Missing `data-src` or `data-srcset` attribute: <img>
```

If you want to disable these warnings, you can use the following build flag:

- `__UNLAZY_LOGGING__`: This flag is set to `true` by default.
