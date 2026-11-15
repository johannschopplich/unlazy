# API

| Function | Import | Purpose |
| --- | --- | --- |
| [`lazyLoad`](/api/lazy-load) | `unlazy` | Initialize lazy loading with placeholder generation |
| [`autoSizes`](/api/auto-sizes) | `unlazy` | Calculate `sizes` attribute without lazy loading |
| [`triggerLoad`](/api/trigger-load) | `unlazy` | Programmatically load an image immediately |
| [`createPlaceholderFromHash`](/api/create-placeholder-from-hash) | `unlazy` | Generate PNG data URI from hash (client-side) |
| [`reportImageOutcome`](/integrations/#creating-custom-integrations) | `unlazy` | Set or clear `data-error` and call `onImageLoad` or `onImageError` for an image that loads its own sources |
| [`resolveImageAttributes`](/integrations/#creating-custom-integrations) | `unlazy` | Resolve the `<img>` and `<source>` attributes, the `lazyLoad` options, and a `loadKey` of an `UnLazyImage` component from its props |
| [`createPngDataUri`](/api/blurhash-create-png-data-uri) | `unlazy/blurhash` | Generate PNG data URI from BlurHash (SSR) |
| [`createPngDataUri`](/api/thumbhash-create-png-data-uri) | `unlazy/thumbhash` | Generate PNG data URI from ThumbHash (SSR) |

## Constants

| Constant | Import | Purpose |
| --- | --- | --- |
| [`isCrawler`](/guide/seo-considerations#crawlers-get-the-real-image) | `unlazy` | Boolean indicating if the current visitor is detected as a bot or crawler |

## Types

| Type | Import | Purpose |
| --- | --- | --- |
| `UnLazyLoadOptions` | `unlazy` | Options for the `lazyLoad` function |
| `TriggerLoadOptions` | `unlazy` | Options for the `triggerLoad` function, which `UnLazyLoadOptions` extends |
| `AutoSizesOptions` | `unlazy` | Options for the `autoSizes` function |
| `CreatePlaceholderFromHashOptions` | `unlazy` | Options for the `createPlaceholderFromHash` function |
| [`UnLazySource`](/integrations/#unlazysource) | `unlazy` and every adapter package | One `<source>` of the `sources` prop |
| [`UnLazyImageProps`](/integrations/#unlazyimage-props) | `unlazy` | Props every `UnLazyImage` component shares |
| `ResolveImageAttributesOptions` | `unlazy` | Options for the `resolveImageAttributes` function: `UnLazyImageProps` plus the `lazyLoad` prop of the Vue and Nuxt components |
| `UnLazyImageAttributes` | `unlazy` | Return type of `resolveImageAttributes` |
