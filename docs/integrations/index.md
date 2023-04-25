# Integrations

unlazy supports lazy loading images in your framework of choice. The following integrations are available as of now:

## Frontend Frameworks

- [Vue](/integrations/vue)
- [React](/integrations/react)
- [Solid](/integrations/solid)
- [Svelte](/integrations/svelte)

## Meta-Frameworks

- [Nuxt](/integrations/nuxt)

::: tip
These include SSR-decoding of [BlurHash](/placeholders/blurhash) and [ThumbHash](/placeholders/thumbhash) strings.
:::

## Generic How-To

To create a component for the framework of your choice, keep the following in mind:

1. The component should wrap a native `<img>` element with the `loading="lazy"` attribute set.
2. The component should support at least a `src` or `srcset` attribute.
3. Import the [`lazyLoad`](/api/lazy-load) function from the unlazy library and call it with a `HTMLImageElement` or `HTMLSourceElement` as the first argument:

```ts
import { lazyLoad } from 'unlazy'

lazyLoad(target)
```

4. If the component gets unmounted before the image is loaded, call the cleanup function returned by `lazyLoad`. Take the following example from the [Vue integration](/integrations/vue):

```ts
import { lazyLoad } from 'unlazy'

const target = ref<HTMLImageElement | undefined>()

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value)
    onBeforeUnmount(cleanup)
  }
})
```

That's it!

## Server-Side Rendering

unlazy supports server-side rendering for BlurHash and ThumbHash strings. This means that you can generate the placeholder images for the `src` attribute with SSR and avoid the [Cumulative Layout Shift](https://web.dev/cls/) (CLS) caused by the images loading after the page has been rendered.

Both the `unlazy/blurhash` and `unlazy/thumbhash` exports provide a `createPngDataUri` function that can be used to generate a PNG data URI for a BlurHash or ThumbHash string, respectively. This function can be used to generate the `src` attribute for the `<img>` element.

- BlurHash [`createPngDataUri`](/api/blurhash-create-png-data-uri) – Generate a PNG data URI for a BlurHash string
- ThumbHash [`createPngDataUri`](/api/thumbhash-create-png-data-uri) – Generate a PNG data URI for a ThumbHash string

::: tip
The [Nuxt](/integrations/nuxt) integration uses this approach to enable the `UnLazyImage` component to provide an SSR `src` attribute for the initial render.
:::
