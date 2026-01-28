# SEO Considerations

When implementing lazy loading with blurry placeholders, consider the SEO impact. Search engine bots and crawlers may not behave like human visitors. unlazy ensures images are indexed correctly without compromising quality due to blurry placeholders.

## Detects Bots and Crawlers

unlazy exports an `isCrawler` constant that indicates whether the current visitor is detected as a bot or crawler, ensuring full-quality images are loaded and indexed by search engines.

The detection mechanism works by:

1. **User Agent Check**: Scans for common bot identifiers (e.g., `bot`, `crawler`, `spider`, `googlebot`).
2. **onscroll Support Detection**: Checks if the browser supports the `onscroll` event, which is typically absent in headless browsers and crawlers.
3. **Immediate Loading**: If detected as a crawler, `data-srcset` and `data-src` attributes are immediately converted to their standard counterparts.

The library trusts that bots and crawlers can evaluate the `srcset` attribute and select appropriate image sources for indexing.

## Use `src`, `data-srcset` and `sizes`, or `data-src` Attributes

Set the `src` attribute with the blurry placeholder and use `data-srcset` (or `data-src`) for the high-quality image. This displays placeholders during initial render while loading full-quality images as they enter the viewport.

Use the `sizes` attribute (or [`data-sizes="auto"`](/guide/usage#auto-calculation-of-the-sizes-attribute) for automatic calculation) to provide search engines with the intended display size. This enables search engines to select the appropriate image source from the `srcset` attribute when indexing.
