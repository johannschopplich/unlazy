# Integrations

unlazy supports lazy loading images in your framework of choice. To create a component for the framework of your choice, keep the following in mind:

## Generic How-To

1. The component should wrap a native `<img>` element with the `loading="lazy"` attribute set.
2. The component should support at least a `src` or `srcset` attribute.
3. Import the [`lazyLoad`](/api/lazy-load) function from the unlazy library and call it with a `HTMLImageElement` or `HTMLSourceElement` as the first argument:

```ts
import { lazyLoad } from 'unlazy'
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

That's it! Optionally, you can create a SSR-friendly component that uses the [`createPngDataUriFromBlurHash`](/api/create-png-data-uri-from-blur-hash) function to create a placeholder image from a [BlurHash](/guide/blurhash) string on the server.
