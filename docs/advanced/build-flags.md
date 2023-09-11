# Build Flags

This guide will focus on build flags to enable bundlers like [Rollup](https://rollupjs.org) to tree-shake features that are not used in your project.

Most bundlers provide a `define` option to set build flags:

- [Vite](https://vitejs.dev/config/shared-options.html#define)
- [@rollup/plugin-replace](https://www.npmjs.com/package/@rollup/plugin-replace)
- [esbuild](https://esbuild.github.io/api/#define)

## Disable Hash Decoding <Badge type="info" text="^0.10.0" />

unlazy ships with the [BlurHash](/placeholders/blurhash) and [ThumbHash](/placeholders/thumbhash) decoding algorithms to decode the hash values into images.

In case your project doesn't use these placeholders, you can disable the hash decoding algorithms to reduce the bundle size. Use the following build flags to tree-shake the hash decoding algorithms:

- `__ENABLE_HASH_DECODING__`: This flag is set to `true` by default.

As an example, you can tree-shake the hash decoding algorithms in Vite by setting the `define` option in your `vite.config.ts` file:

```ts
// `vite.config.ts`
import { defineConfig } from 'vite'

export default defineConfig({
  define: {
    __ENABLE_HASH_DECODING__: false,
  },
})
```

::: warning
This will only tree-shake the BlurHash and ThumbHash decoding algorithms when using the [`lazyLoad`](/api/lazy-load) method.

If you use either `unlazy/blurhash` or `unlazy/thumbhash` sub-path imports directly, the decoding algorithms will still be bundled.
:::
