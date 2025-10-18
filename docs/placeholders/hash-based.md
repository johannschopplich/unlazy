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

ThumbHash strings are typically shorter and produce higher quality placeholders, making them an excellent choice for modern web applications.

## Client-Side Decoding

### Using `data-` Attributes

By default, unlazy automatically decodes hash strings when a `data-blurhash` or `data-thumbhash` attribute is present on an `<img>` tag.

::: code-group
  ```html [BlurHash]
  <img
    data-src="image.jpg"
    data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  >
  ```
  ```html [ThumbHash]
  <img
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

  const image = document.querySelector('#image')

  lazyLoad(image, {
    hash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
    hashType: 'blurhash'
  })
  ```
  ```ts [ThumbHash]
  import { lazyLoad } from 'unlazy'

  const image = document.querySelector('#image')

  lazyLoad(image, {
    hash: '1QcSHQRnh493V4dIh4eXh1h4kJUI',
    hashType: 'thumbhash'
  })
  ```
:::

::: info
The `hashType` defaults to `blurhash` if not specified.
:::

### Disabling Hash Decoding

To disable hash decoding altogether, pass `false` to the `hash` option. This disables both BlurHash and ThumbHash decoding.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  hash: false
})
```

## Server-Side Decoding

If you are using a server-side framework, you can use the `createPngDataUri` function to create a PNG data URI from a hash string. The resulting data URI can then be used as the `src` attribute of an image.

::: code-group
  ```ts [BlurHash]
  import { createPngDataUri } from 'unlazy/blurhash'

  const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
  const pngDataUri = createPngDataUri(blurhash)
  ```
  ```ts [ThumbHash]
  import { createPngDataUri } from 'unlazy/thumbhash'

  const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
  const pngDataUri = createPngDataUri(thumbhash)
  ```
:::

For a complete list of options, see the API documentation:

- BlurHash [`createPngDataUri`](/api/blurhash-create-png-data-uri)
- ThumbHash [`createPngDataUri`](/api/thumbhash-create-png-data-uri)
