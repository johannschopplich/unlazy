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

You can target specific images by passing a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load to [`lazyLoad`](/api/lazy-load).

:::tip
For more use cases, head over to the [Usage](/guide/usage) guide.
:::

## Without a Build Step

unlazy can be used without a build step. Useful for prototyping or when you don't want to add a build step to your project. Simply load it from a CDN:

- Global build: <CdnLink name="unlazy.iife.js" />
  - Exposes `UnLazy` global property, supports auto initializing
- ESM build: <CdnLink name="unlazy.js" />
  - Must be used with `<script type="module">`

### Auto-Initialization

When using the global build, you can use the `init` attribute to automatically initialize and watch all elements that have a `loading="lazy"` attribute:

```html
<script src="https://unpkg.com/unlazy" defer init></script>
```

- The `defer` attribute makes the script execute after HTML content is parsed.
- The `init` attribute tells the library to automatically initialize and watch all elements that have a `loading="lazy"` attribute.

::: info
The short CDN URLs are meant for prototyping. For production usage, use a fully resolved CDN URL to avoid resolving and redirect cost:
:::

### Manual Initialization

If you don't want the auto-initialize, remove the `init` attribute and move the scripts to end of the `<body>` tag:

```html
<script src="https://unpkg.com/unlazy"></script>
<script>
  UnLazy.lazyLoad()
</script>
```

::: info
The short CDN URLs are meant for prototyping. For production usage, use a fully resolved CDN URL to avoid resolving and redirect cost:
:::

## Example

Regardless of the installation method, the following example shows how to use the `loading="lazy"` attribute with a blurry placeholder image:

```html
<!-- Image with blurry placeholder -->
<img
  src="data:image/svg+xml, ..."
  loading="lazy"
  data-srcset="/foo.png 1024w, /foo-2x.png 2048w"
  data-sizes="auto"
  width="1024"
  height="768"
  style="aspect-ratio: 4/3"
  alt="Image with blurry placeholder"
>
```

:::tip
For more examples, head over to the [Usage](/guide/usage) guide.
:::
