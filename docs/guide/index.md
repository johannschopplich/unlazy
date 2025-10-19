# What Is unlazy?

unlazy is a universal lazy loading library leveraging native browser APIs. It is intended to be used with inlined (blurry) placeholder images or a placeholder image representation like a [BlurHash](/placeholders/hash-based#blurhash) or [ThumbHash](/placeholders/hash-based#thumbhash) alongside the native `loading="lazy"` attribute.

Images are initially rendered with blurry placeholders, giving the user an impression of the page layout and content. As the images enter the viewport, they are replaced with the full-quality versions, providing a smoother experience. This approach prioritizes the initial rendering of the page and improves the perceived performance for users, especially when the connection is slow or unstable.

## How It Works

unlazy enhances the native `loading="lazy"` attribute by processing images and managing their lifecycle:

1. **Data Attribute Processing**: Uses `data-src`, `data-srcset`, and `data-sizes` attributes which are swapped to standard attributes when images load. This prevents browsers from eagerly loading images before they enter the viewport.

2. **Placeholder Generation**: Decodes [BlurHash](/placeholders/hash-based#blurhash) or [ThumbHash](/placeholders/hash-based#thumbhash) strings (via `data-blurhash` or `data-thumbhash` attributes) into PNG data URIs for placeholders.

3. **Chrome Workaround**: Generates unique indexed SVG placeholders to prevent Chrome's aggressive image loading behavior that can trigger load events prematurely.

4. **Automatic Sizes Calculation**: Calculates the `sizes` attribute based on the image's display width when `data-sizes="auto"` is set.

unlazy leverages native browser APIs rather than replacing them, offering a good balance between performance and user experience for image-heavy applications.

## SEO

unlazy ensures that search engines can index the full-quality images by detecting whether the visitor is a bot or a crawler.

## Getting Started

Head over to the [installation guide](/guide/installation) to learn how to install unlazy in your project. After that, you can check out the [usage guide](/guide/usage) and may take a look at the [API reference](/api/).

If you want to use hash-based placeholders like [BlurHash](https://blurha.sh) or [ThumbHash](https://github.com/evanw/thumbhash), check out the [hash-based placeholders guide](/placeholders/hash-based).
