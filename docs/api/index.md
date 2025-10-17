# Overview

unlazy provides a number of methods to help you with lazy loading images. The following methods are available:

- [`lazyLoad`](/api/lazy-load) – Lazy load images with automatic placeholder generation
- [`autoSizes`](/api/auto-sizes) – Automatically calculate the `sizes` attribute
- [`loadImage`](/api/load-image) – Manually load an image before it enters the viewport
- [`createPlaceholderFromHash`](/api/create-placeholder-from-hash) – Generate PNG data URI from BlurHash or ThumbHash

## Server-Side Rendering

unlazy supports server-side rendering for BlurHash and ThumbHash strings. This means that you can generate the placeholder images for the `src` attribute during SSR and avoid the [Cumulative Layout Shift](https://web.dev/cls/) (CLS) caused by the images loading after the page has been rendered.

Both the `unlazy/blurhash` and `unlazy/thumbhash` exports provide a `createPngDataUri` function that can be used to generate a PNG data URI for a BlurHash or ThumbHash string, respectively. This function can be used to generate the `src` attribute for the `<img>` element.

- [`createPngDataUri`](/api/blurhash-create-png-data-uri) – Generate a PNG data URI for a BlurHash string
- [`createPngDataUri`](/api/thumbhash-create-png-data-uri) – Generate a PNG data URI for a ThumbHash string
