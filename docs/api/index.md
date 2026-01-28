# Overview

| Function | Import | Purpose |
| --- | --- | --- |
| [`lazyLoad`](/api/lazy-load) | `unlazy` | Initialize lazy loading with placeholder generation |
| [`autoSizes`](/api/auto-sizes) | `unlazy` | Calculate `sizes` attribute without lazy loading |
| [`triggerLoad`](/api/trigger-load) | `unlazy` | Programmatically load an image immediately |
| [`createPlaceholderFromHash`](/api/create-placeholder-from-hash) | `unlazy` | Generate PNG data URI from hash (client-side) |
| [`createPngDataUri`](/api/blurhash-create-png-data-uri) | `unlazy/blurhash` | Generate PNG data URI from BlurHash (SSR) |
| [`createPngDataUri`](/api/thumbhash-create-png-data-uri) | `unlazy/thumbhash` | Generate PNG data URI from ThumbHash (SSR) |

## Constants

| Constant | Import | Purpose |
| --- | --- | --- |
| `isCrawler` | `unlazy` | Boolean indicating if the current visitor is detected as a bot or crawler |
| `isLazyLoadingSupported` | `unlazy` | Boolean indicating if the browser supports native lazy loading |

## Types

| Type | Import | Purpose |
| --- | --- | --- |
| `UnLazyLoadOptions` | `unlazy` | Options for the `lazyLoad` function |

## Deprecated

| Function | Replacement | Notes |
| --- | --- | --- |
| `loadImage` | [`triggerLoad`](/api/trigger-load) | Alias that will be removed in the next major version |
