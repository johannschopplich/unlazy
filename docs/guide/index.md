# What Is unlazy?

unlazy is a lazy loading library that leverages native browser APIs. It uses inlined placeholder images or hash-based representations like [BlurHash](/guide/placeholders#blurhash) or [ThumbHash](/guide/placeholders#thumbhash) alongside the native `loading="lazy"` attribute.

Images render with blurry placeholders initially, then swap to full-quality versions as they enter the viewport. This improves perceived performance, especially on slow connections.

## How It Works

unlazy enhances `loading="lazy"` by processing images and managing their lifecycle:

1. **Data Attribute Processing**: Uses `data-src`, `data-srcset`, and `data-sizes` attributes which are swapped to standard attributes when images load.

2. **Placeholder Generation**: Decodes [BlurHash](/guide/placeholders#blurhash) or [ThumbHash](/guide/placeholders#thumbhash) strings into PNG data URIs for placeholders.

3. **Chrome Workaround**: Generates unique indexed SVG placeholders to prevent Chrome's aggressive loading behavior that triggers load events prematurely.

4. **Auto Sizes**: Calculates the `sizes` attribute based on display width when `data-sizes="auto"` is set.

## Browser Compatibility

unlazy works in all evergreen browsers (Chrome, Firefox, Safari, Edge). For browsers without native lazy loading support, images load immediately as a graceful fallback. You can check support programmatically using the exported `isLazyLoadingSupported` constant.

## SEO

unlazy detects bots and crawlers, loading full-quality images immediately for proper indexing. See [SEO considerations](/guide/seo-considerations).

## Getting Started

1. [Install](/guide/installation) the `unlazy` package
2. Review the [usage guide](/guide/usage)
3. Optionally, set up [placeholders](/guide/placeholders) (BlurHash or ThumbHash)
