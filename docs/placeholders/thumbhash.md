# ThumbHash

unlazy supports client-side and server-side (SSR) decoding of [ThumbHash](https://github.com/evanw/thumbhash) strings. This allows you to use ThumbHash placeholders for images that are not yet loaded.

A ThumbHash is a very compact representation of a placeholder for an image. Compared to [BlurHash](https://blurha.sh), it offers several advantages:

- Encodes more detail in the same space
- Automatically encodes the aspect ratio (no need to specify separately)
- Provides more accurate colors
- Supports images with alpha channels

ThumbHash strings are typically shorter and produce higher quality placeholders, making them an excellent choice for modern web applications.

## Client-Side Decoding

### `data-thumbhash` Attribute

By default, unlazy will decode ThumbHash strings on the client-side automatically when a `data-thumbhash` is present on a `<img>` tag.

```html
<img
  data-src="image.jpg"
  data-thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
>
```

### `hash` Option

If you are initializing unlazy for single images, i.e. in a frontend framework component of your choice, you can pass a custom `hash` string to the [`lazyLoad`](/api/lazy-load) function. It has higher priority than the `data-thumbhash` attribute.

```ts
import { lazyLoad } from 'unlazy'

const image = document.querySelector('#image')

lazyLoad(image, {
  hash: '1QcSHQRnh493V4dIh4eXh1h4kJUI',
  hashType: 'thumbhash'
})
```

### Disabling ThumbHash Decoding

To disable ThumbHash decoding altogether, pass `false` to the `hash` option.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  hash: false
})
```

::: info
This will also disable [BlurHash](/placeholders/blurhash) decoding.
:::

## Server-Side Decoding

If you are using a server-side framework, you can use the [`createPngDataUri`](/api/thumbhash-create-png-data-uri) function to create a PNG data URI from a ThumbHash string. The resulting data URI can then be used as the `src` attribute of an image.

```ts
import { createPngDataUri } from 'unlazy/thumbhash'

const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
const pngDataUri = createPngDataUri(thumbhash)
```

For a complete list of options, see the [`createPngDataUri` API documentation](/api/thumbhash-create-png-data-uri).
