# Integrations

unlazy supports lazy loading images in your framework of choice. Each package provides a `UnLazyImage` component as a drop-in replacement for the native `<img>` element.

## Creating Custom Integrations

To create a component for your framework, keep the following in mind:

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

## Server-Side Rendering

unlazy's hash decoders work in any SSR runtime (Node, Deno, Bun, Workers). See [Server-Side Rendering](/advanced/ssr) for framework-specific recipes.

## Available Integrations

The following integrations are available as of now:

### Frontend Frameworks

- [Vue](/integrations/vue)
- [React](/integrations/react)
- [Solid](/integrations/solid)
- [Svelte](/integrations/svelte)

### Meta-Frameworks

::: tip
These include SSR-decoding of [hash-based placeholders](/guide/placeholders) (BlurHash and ThumbHash).
:::

- [Nuxt](/integrations/nuxt)
