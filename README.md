![unlazy library](./.github/og.jpg)

# unlazy

Universal lazy loading library leveraging native browser APIs. It's intended to be used with the `loading="lazy"` attribute alongside placeholder images, i.e. a blurry placeholder image.

It's the rewritten version of my [Loadeer.js](https://github.com/johannschopplich/loadeer) library, which uses an Intersection Observer to detect when an image enters the viewport.

> **Note**
>
> Although the `loading="lazy"` attribute is supported in all major browsers, it is only available in Safari 16.4 (released March 2023) and later versions by default. It is important to consider this limitation when using unlazy for your project, as it might impact the user experience for visitors using older Safari versions or other unsupported browsers.

## Key Features

- 🍃 **Zero dependencies**: 0.7 kB minified & gzipped
- 🎀 **Native**: Utilizes the `loading="lazy"` attribute for modern browsers
- 🪄 **Sizing**: Automatically calculates the `sizes` attribute
- 🏎 **Auto initialize**: with the `init` script attribute
- 🔧 **Customizable**: Use `data` attributes for image sources
- 🎟 **`<picture>`**: Supports multiple image formats
- 🔍 **SEO-friendly**: Detects e.g. Google Bot and preloads all images

## How it Works

unlazy offers a tailored solution for those who prefer to use blurry placeholders for image loading. This approach prioritizes the initial rendering of the page and improves the perceived performance for users, especially when the connection is slow or unstable.

The library's implementation ensures that search engines can index the full-quality images by detecting whether the visitor is a bot or a crawler. It processes all images with a `loading="lazy"` attribute, calculates the sizes attribute if necessary, and checks if the image has a blurry placeholder (given the `data-srcset` attribute).

It ensures that images are initially rendered with blurry placeholders, giving the user an impression of the page layout and content. As the images enter the viewport, they are replaced with the full-quality versions, providing a smoother experience.

unlazy intends to offer a good balance between performance and user experience and works well for specific use cases where blurry placeholders are the preferred method for image loading.

## Installation

Use the ES module build by installing the [`unlazy` npm package](https://www.npmjs.com/package/unlazy):

```js
import { lazyLoadImages } from 'unlazy'

// Apply lazy loading for all `img[loading="lazy"]` images
lazyLoadImages()
```

You can customize the CSS selectors to target specific images by passing a string or an array of strings to [`lazyLoadImages`](#lazyloadimagesselectors-string).

The following example shows how to use the `loading="lazy"` attribute with a blurry placeholder image:

```html
<!-- Image with blurry placeholder -->
<img
  src="data:image/svg+xml, ..."
  loading="lazy"
  data-srcset="/foo.png 1024w, /foo-2x.png 2048w"
  data-sizes="auto"
  width="1024"
  height="768"
  style="aspect-ratio: 4/3"
  alt="Image with blurry placeholder"
>
```

### Installation Without a Build Step

#### Auto-Initialization

unlazy can be used without a build step. Simply load it from a CDN:

```html
<script src="https://unpkg.com/unlazy" defer init></script>
```

- The `defer` attribute makes the script execute after HTML content is parsed.
- The `init` attribute tells the library to automatically initialize and watch all elements that have a `loading="lazy"` attribute.

#### Manual Initialization

If you don't want the auto initialize, remove the `init` attribute and move the scripts to end of `<body>`:

```html
<script src="https://unpkg.com/unlazy"></script>
<script>
  unlazy.lazyLoadImages()
</script>
```

#### Production CDN URLs

The short CDN URLs are meant for prototyping. For production usage, use a fully resolved CDN URL to avoid resolving and redirect cost:

- Global build: https://unpkg.com/unlazy@0.1.0/dist/unlazy.iife.js
  - Exposes `unlazy` global property, supports auto initializing
- ESM build: https://unpkg.com/unlazy@0.1.0/dist/unlazy.es.js
  - Must be used with `<script type="module">`

## Usage

Add the `loading="lazy"` attribute to an `<img>` element or a `<source>` element within a `<picture>` element that you want to lazily load. Set a `src` attribute with the blurry placeholder and a `data-srcset` attribute for the high-quality image.

```html
<!-- You can use the `<img>` tag -->
<img
  loading="lazy"
  src="data:image/svg+xml, ..."
  data-srcset="image.png"
  data-sizes="auto"
>

<!-- … or the `<picture>` element -->
<picture>
  <source
    loading="lazy"
    src="data:image/svg+xml, ..."
    data-srcset="/foo.jpg"
    media="(min-width: 800px)"
  >
</picture>
```

In your JavaScript file, import the `lazyLoadImages` function from the library and call it:

```ts
import { lazyLoadImages } from 'unlazy'

// Lazily load all `img[loading="lazy"]` images
lazyLoadImages()
```

### Auto Calculation of the `sizes` Attribute

unlazy supports setting the `sizes` attribute automatically, corresponding to the current size of your image – just set the value of `data-sizes` to `auto`.

The automatic sizes calculation uses the display width of the image.

```html
<img
  loading="lazy"
  src="data:image/svg+xml, ..."
  data-srcset="image-480w.jpg 480w, image-800w.jpg 800w"
  data-sizes="auto"
>
```

When calling `lazyLoadImages()`, the library will automatically calculate the `sizes` attribute for all images with `data-sizes="auto"`.

Alternatively, you can use the `autoSizes()` function to calculate the `sizes` attribute for all images with `data-sizes="auto"`, without lazy loading the images.
To do so, import the `autoSizes` function from the library and call it:

```ts
import { autoSizes } from 'unlazy'

// Automatically calculate the sizes attribute for all `img[data-sizes="auto"], source[data-sizes="auto"]` images, without lazy loading them
autoSizes()
```

### Custom Selector

You can customize the CSS selectors to target specific images by passing a string to `lazyLoadImages()` and `autoSizes()`.

For example, if you want to target images with a `data-custom-lazy` attribute, you can set the selector to `img[data-custom-lazy]`:

```ts
import { lazyLoadImages } from 'unlazy'

lazyLoadImages('img[data-custom-lazy]')
```

> **Note**
>
> The `loading="lazy"` attribute is still required for the images to be lazy loaded.

### Manually Loading Images

If you want to load an image before it enters the viewport, you can call the `loadImage` function directly. It accepts an `HTMLImageElement`. Import the `loadImage` function from the library and call it:

```ts
import { loadImage } from 'unlazy'

const coolImage = document.querySelector('.image-to-load-first')

// Trigger the load before the image enters the viewport
loadImage(coolImage)
```

Keep in mind that manually loading images might negatively affect the perceived performance, as it will force the full-quality image to load immediately, even if it's not visible on the viewport.

## API

### `lazyLoadImages(selectors)`

The main method of the library. It works as follows:

1. Detects whether the visitor is a bot or a crawler. This ensures that the full-quality image is loaded and indexed by search engines. The `data-srcset` attribute will be converted to `srcset`.
2. Processes all images with a `loading="lazy"` attribute: it calculates the image's `sizes` attribute if `data-sizes="auto"` is set and then checks if the image has a blurry placeholder (given the `data-srcset` attribute).
3. If the image has a blurry placeholder and is already in the viewport or the visitor is a crawler, it immediately loads the full-quality image.
4. If the image is not yet in the viewport, an event listener is added to load the full-quality image when it enters the viewport.

**Type Declaration**

```ts
function lazyLoadImages(
  /**
   * A CSS selector or a list of CSS selectors to match images to lazy load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectors?: string,
  /**
   * A callback function to run when an image is loaded.
   */
  onLoaded?: (image: HTMLImageElement) => void
): void
```

#### `selectors`

Defaults to `img[loading="lazy"]`. Allowed types are a valid CSS selector string.

#### `onLoaded`

An optional callback function to run when an image is loaded. It accepts an `HTMLImageElement` as a parameter.

### `autoSizes(selectors)`

**Type Declaration**

```ts
function autoSizes(
  /**
   * A CSS selector or a list of CSS selectors to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectors?: string
): void
```

#### `selectors`

Defaults to `img[data-sizes="auto"], source[data-sizes="auto"]`. Allowed types are a valid CSS selector string.

### `loadImage(element)`

**Type Declaration**

```ts
function loadImage(
  image: HTMLImageElement,
  onLoaded?: (image: HTMLImageElement) => void
): void
```

#### `element`

An instance of `HTMLImageElement` representing the image you want to load manually.

## Cookbook

### Setting Aspect Ratio for Blurry Placeholders

In certain cases, the blurry placeholder might not have the full image width and height. To ensure that the layout does not change when the full-quality image loads and to maintain a consistent user experience, you can add the `aspect-ratio` CSS property to the `style` attribute to your images.

Calculate the aspect ratio using the dimensions of the full-quality image (width / height) and apply it to the `<img>` tag:

```html
<img
  src="data:image/svg+xml, ..."
  loading="lazy"
  data-srcset="/foo.png 1024w, /foo-2x.png 2048w"
  data-sizes="auto"
  width="1600"
  height="900"
  style="aspect-ratio: 16 / 9;"
>
```

By setting the aspect ratio for your blurry placeholders, you can:

- Prevent layout shifts as the full-quality image loads.
- Ensure that the image container maintains its dimensions even before the full-quality image is loaded.

## SEO Considerations

When implementing lazy loading with blurry placeholders, it is important to consider the impact it may have on SEO. Search engine bots and crawlers are responsible for indexing and ranking your website's content, and they might not always behave like human visitors when browsing the site. unlazy ensures that your website's images are indexed correctly and that their quality is not negatively affected by the use of blurry placeholders.

### Detects Bots and Crawlers

unlazy provided includes an exported function called `isCrawler` that detects if the visitor is a bot or a crawler. This is useful to ensure that the full-quality image is loaded and indexed by search engines. The library trusts that bots and crawlers can evaluate the `srcset` attribute and load the appropriate image based on their needs.

The `isCrawler` function checks the user agent string for common bot and crawler identifiers and determines if the `onscroll` event is supported by the browser. This information is then used to decide whether to immediately load the full-quality image or to use the blurry placeholder approach for the specific visitor.

### Use `src`, `data-srcset`, and `sizes` Attributes

When using blurry placeholders, it is important to set the `src` attribute with the blurry placeholder image and use the `data-srcset` attribute for the high-quality image. This ensures that the initial rendering of the page will display the blurry placeholders, while the full-quality images will be loaded later as they enter the viewport.

Additionally, using the `sizes` attribute (or `data-sizes="auto"` for automatic calculation) helps provide the search engine with information about the intended display size of the image. This enables search engines to select the most appropriate image source from the `srcset` attribute when indexing your website's content.

## License

[MIT](./LICENSE) License © 2023-present [Johann Schopplich](https://github.com/johannschopplich)
