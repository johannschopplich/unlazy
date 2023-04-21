# Integrations

unlazy supports lazy loading images in your framework of choice. The following integrations are available as of now:

- [Vue](/integrations/vue)
- [React](/integrations/react)
- [Solid](/integrations/solid)
- [Nuxt](/integrations/nuxt) (including SSR-decoding of BlurHash strings)

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

Optionally, you can create an SSR-friendly component that uses the [`createPngDataUri`](/api/blurhash-create-png-data-uri) function to create a placeholder image from a [BlurHash](/guide/blurhash) string on the server.

The [Nuxt](/integrations/nuxt) integration uses this approach to enable the `UnLazyImage` component to provide an SSR `src` attribute for the initial render.
