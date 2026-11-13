# Hash-Based Placeholders

unlazy supports client-side and server-side (SSR) decoding of hash-based placeholder formats. These compact string representations encode image placeholders, providing more detail than a solid color while remaining small enough to embed directly in HTML or JSON responses.

## Supported Formats

### BlurHash

[BlurHash](https://blurha.sh) is a compact string representation that encodes an image placeholder. It provides a blurry preview of the image before the full-quality version loads.

### ThumbHash

[ThumbHash](https://github.com/evanw/thumbhash) is a very compact representation of a placeholder for an image. Compared to BlurHash, it offers several advantages:

- Encodes more detail in the same space
- Automatically encodes the aspect ratio (no need to specify separately)
- Provides more accurate colors
- Supports images with alpha channels

## Decode in the Browser or on the Server?

Client-side decoding requires including the hash decoding library in your JavaScript bundle, which increases bundle size. Placeholders appear once `lazyLoad()` has run instead of on first paint.

Server-side decoding generates PNG data URIs on the server and embeds them in the HTML, so the placeholder is visible on first paint. The client bundle only gets smaller once you also [disable hash decoding](/advanced/build-flags#disable-hash-decoding). The BlurHash [`createPngDataUri`](/api/blurhash-create-png-data-uri) and ThumbHash [`createPngDataUri`](/api/thumbhash-create-png-data-uri) functions create the data URI from a hash string; for the markup to emit and a full recipe, see [Server-Side Rendering](/advanced/ssr).

## Client-Side Decoding

### Using `data-` Attributes

By default, unlazy automatically decodes hash strings when a `data-blurhash` or `data-thumbhash` attribute is present on an `<img>` tag. If an image has both, `data-thumbhash` wins.

::: warning
Set explicit `width` and `height` attributes on BlurHash images. A BlurHash doesn't store its aspect ratio, so unlazy takes it from the rendered size of the image and decodes a square placeholder when the image has no size yet.
:::

::: code-group
  ```html [BlurHash]
  <img
    loading="lazy"
    width="800"
    height="600"
    data-src="image.jpg"
    data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  >
  ```
  ```html [ThumbHash]
  <img
    loading="lazy"
    width="800"
    height="600"
    data-src="image.jpg"
    data-thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
  >
  ```
:::

### Using `hash` Option

When initializing unlazy for single images (e.g., in a framework component), you can pass a custom `hash` string to the [`lazyLoad`](/api/lazy-load) function. It has higher priority than the `data-blurhash` or `data-thumbhash` attributes.

::: code-group
  ```ts [BlurHash]
  import { lazyLoad } from 'unlazy'

  const image = document.querySelector<HTMLImageElement>('#image')!

  lazyLoad(image, {
    hash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
    hashType: 'blurhash'
  })
  ```
  ```ts [ThumbHash]
  import { lazyLoad } from 'unlazy'

  const image = document.querySelector<HTMLImageElement>('#image')!

  lazyLoad(image, {
    hash: '1QcSHQRnh493V4dIh4eXh1h4kJUI',
    hashType: 'thumbhash'
  })
  ```
:::

### Disabling Hash Decoding

To disable hash decoding altogether, pass `false` to the `hash` option. This disables both BlurHash and ThumbHash decoding.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  hash: false
})
```

## Using Your Own Placeholder

Hash-based placeholders are convenient when you only have a compact string on hand, but they are not the only option. If your image pipeline already produces a tiny WebP, JPEG, or AVIF preview – as Sharp, imgix, Cloudinary, and most modern CDNs do – put that data URL, or an inline SVG dominant-color fill, directly into `src`:

```html
<img
  src="data:image/webp;base64,UklGRi..."
  data-src="real.jpg"
  alt="Article cover"
  width="1200"
  height="800"
  loading="lazy"
>
```

When no `data-blurhash` or `data-thumbhash` attribute is present on the image, unlazy leaves `src` alone. The browser decodes the placeholder natively, and no library code runs on the placeholder path. To also drop the hash decoders from your bundle, set [`__UNLAZY_HASH_DECODING__`](/advanced/build-flags#disable-hash-decoding) to `false`.
