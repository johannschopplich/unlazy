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

::: warning
For optimal performance when using BlurHash, always set explicit `width` and `height` attributes on your images. Without these attributes, the library falls back to the rendered dimensions (`offsetWidth`/`offsetHeight`), which can cause BlurHash to decode at full image size instead of the default 32px. This may result in significant performance delays on large images.
:::

::: code-group
  ```html [BlurHash]
  <img
    width="800"
    height="600"
    data-src="image.jpg"
    data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  >
  ```
  ```html [ThumbHash]
  <img
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

## Hash Decoding Strategies

Both approaches have distinct characteristics that affect bundle size and user experience:

### Client-Side Decoding

Requires including the hash decoding library in your JavaScript bundle, which increases bundle size. However, placeholders are visible immediately on page load, providing instant visual feedback to users.

### Server-Side Decoding

Generates PNG data URIs on the server, keeping your client bundle smaller. The placeholder image is embedded directly in the HTML as a data URI. This approach is ideal when minimizing client-side JavaScript is a priority.

::: tip
ThumbHash is more efficient for both approaches due to its smaller hash size and faster decoding performance compared to BlurHash.
:::
