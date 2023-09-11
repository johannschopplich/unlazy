# Build Flags

This guide will focus on build flags to enable Rollup and other bundler to tree-shake features that are not used in your project.

Most bundlers provide a `define` option to set build flags:

- [Vite](https://vitejs.dev/config/shared-options.html#define)
- [@rollup/plugin-replace](https://www.npmjs.com/package/@rollup/plugin-replace)
- [esbuild](https://esbuild.github.io/api/#define)

## Disable Hash Decoding <Badge type="info" text="^0.10.0" />

In case you want to use the `unlazy` library without the hash decoding algorithms, you can use the following build flag to disable them. Bundlers like Rollup will then tree-shake the unused code.

- `__ENABLE_HASH_DECODING__`: This flag is set to `true` by default.

As an example, you can disable the hash decoding algorithms in Vite by setting the `define` option in your `vite.config.ts` file:

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
This will only disable bundling the BlurHash and ThumbHash decoding algorithms when using [`lazyLoad`](/api/lazy-load).

If you use either `unlazy/blurhash` or `unlazy/thumbhash` sub-path imports directly, the decoding algorithms will still be bundled.
:::
