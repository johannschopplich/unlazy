# Installation

Install the `unlazy` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D unlazy
  ```
  ```bash [yarn]
  yarn add -D unlazy
  ```
  ```bash [npm]
  npm install -D unlazy
  ```
:::

To apply lazy loading to all images with the `loading="lazy"` attribute, import the [`lazyLoad`](/api/lazy-load) function and call it:

```ts
import { lazyLoad } from 'unlazy'

// Apply lazy loading for all images by the selector `img[loading="lazy"]`
lazyLoad()
```

You can target specific images by passing a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to [`lazyLoad`](/api/lazy-load).

::: tip
For more use cases, head over to the [Usage](/guide/usage) guide.
:::

## Without a Build Step

unlazy can be used without a build step from a CDN. Useful for prototyping or projects without bundlers.

| Build | File | When to Use |
| --- | --- | --- |
| Standard Global | <CdnLink name="unlazy.iife.js" /> | SSR hash decoding, exposes `UnLazy` global |
| Standard ESM | <CdnLink name="unlazy.js" /> | SSR hash decoding, `<script type="module">` |
| With Hashing Global | <CdnLink name="unlazy.with-hashing.iife.js" /> | Client-side hash decoding |
| With Hashing ESM | <CdnLink name="unlazy.with-hashing.js" /> | Client-side hash decoding, ESM |

::: info
Use standard builds if you decode hashes on the server (SSR). Use `with-hashing` builds only if you need client-side hash decoding.
:::

### Auto-Initialization

When using the global build, you can use the `init` attribute to automatically initialize and watch all elements that have a `loading="lazy"` attribute:

```html
<script src="https://unpkg.com/unlazy" defer init></script>
```

- The `defer` attribute makes the script execute after HTML content is parsed.
- The `init` attribute tells the library to automatically initialize and watch all elements that have a `loading="lazy"` attribute.

::: info
The short CDN URLs are meant for prototyping. For production, use a fully resolved URL to avoid redirect costs: `https://unpkg.com/unlazy@1.0.0/dist/unlazy.iife.js`.
:::

### Manual Initialization

If you do not want to auto-initialize the library, remove the `init` attribute and move the scripts to end of the `<body>` tag:

```html
<script src="https://unpkg.com/unlazy"></script>
<script>
  UnLazy.lazyLoad()
</script>
```
