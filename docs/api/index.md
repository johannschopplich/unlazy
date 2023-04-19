# Overview

unlazy provides a number of methods to help you with lazy loading images. The following methods are available:

- [`lazyLoad`](/api/lazy-load) – Lazy load images
- [`autoSizes`](/api/auto-sizes) – Automatically calculate the `sizes` attribute
- [`loadImage`](/api/load-image) – Manually load an image

## Server-Side Rendering

unlazy supports server-side rendering. You can use the [`createPngDataUriFromBlurHash`](/api/create-png-data-uri-from-blur-hash) function to generate the placeholder images for the `src` attribute with SSR.
