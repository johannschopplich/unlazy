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

## Disable Hash Decoding

unlazy includes [BlurHash](/guide/placeholders#blurhash) and [ThumbHash](/guide/placeholders#thumbhash) decoding algorithms (from the `fast-blurhash` and `thumbhash` packages). If your project doesn't decode hashes in the browser, set `__UNLAZY_HASH_DECODING__` to `false`. Default is `true`.

The bundler then removes the hash-related code paths in `lazyLoad()` and both decoding libraries from the final bundle.

::: warning
This flag only removes hash decoding from `lazyLoad`. `createPlaceholderFromHash`, `unlazy/blurhash`, and `unlazy/thumbhash` still bundle their decoder when you import them. `@unlazy/nuxt` always sets the flag to `true`, so defining it in a Nuxt app has no effect.
:::

## Disable Client Logging

unlazy emits dev-time console output to help you catch configuration mistakes. Set `__UNLAZY_LOGGING__` to `false` to strip all of it from production builds. Default is `true`.

When disabled, the bundler removes:

- **Missing `data-src` / `data-srcset` errors**: logged when an image passed to `lazyLoad` is missing both attributes.
- **Hash decoder failure errors**: logged when a BlurHash or ThumbHash string cannot be decoded.
- **Largest Contentful Paint warning**: logged when the LCP element is still configured for lazy loading.

This is recommended for production IIFE bundles.
