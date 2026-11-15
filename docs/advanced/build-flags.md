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
This flag only removes hash decoding from `lazyLoad`. `createPlaceholderFromHash`, `unlazy/blurhash`, and `unlazy/thumbhash` still bundle their decoder when you import them. `@unlazy/nuxt` imports `createPlaceholderFromHash` to decode on the server, so Nuxt apps keep both decoders. In a Nuxt app, the flag drops only the placeholders of images with `ssr: false`.
:::

## Disable Client Logging

The development build of `unlazy` logs configuration mistakes to the console:

- **Missing `data-src` / `data-srcset` error**: an image passed to `lazyLoad` has neither these attributes nor a `src` or `srcset`.
- **Hash decoder failure error**: a BlurHash or ThumbHash string cannot be decoded.
- **Largest Contentful Paint warning**: the LCP element is still configured for lazy loading.

Your bundler or runtime picks this build when it resolves the `development` export condition:

- **Vite, Vitest, webpack, Rspack, and Parcel** resolve it in development mode, so your production build logs nothing.
- **Rollup** with `@rollup/plugin-node-resolve` 16 or later resolves it when `NODE_ENV` is set to anything but `production`, or with `exportConditions: ['development']`.
- **esbuild, Bun, and Node** resolve it only with `--conditions=development`.

A server bundle that resolves `development` logs too: a hash that fails to decode during server-side rendering logs the hash decoder failure error to the server console.

The other builds, including the [CDN builds](/guide/cdn), log nothing.

Set `__UNLAZY_LOGGING__` to `false` to silence the development build as well. Default is `true`.
