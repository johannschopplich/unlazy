# SEO Considerations

When implementing lazy loading with blurry placeholders, it is important to consider the impact it may have on SEO. Search engine bots and crawlers are responsible for indexing and ranking your website's content, and they might not always behave like human visitors when browsing the site. unlazy ensures that your website's images are indexed correctly and that their quality is not negatively affected by the use of blurry placeholders.

## Detects Bots and Crawlers

unlazy includes an exported function called `isCrawler` that detects if the visitor is a bot or a crawler. This ensures that the full-quality image is loaded and indexed by search engines.

The detection mechanism works by:

1. **User Agent Check**: Scans for common bot identifiers (e.g., `bot`, `crawler`, `spider`, `googlebot`)
2. **onscroll Support Detection**: Checks if the browser supports the `onscroll` event, which is typically absent in headless browsers and crawlers
3. **Immediate Loading**: If detected as a crawler, `data-srcset` and `data-src` attributes are immediately converted to their standard counterparts

The library trusts that bots and crawlers can evaluate the `srcset` attribute and select appropriate image sources for indexing.

## Use `src`, `data-srcset` and `sizes`, or `data-src` Attributes

When using blurry placeholders, it is important to set the `src` attribute with the blurry placeholder image and use the `data-srcset` (or `data-src`) attribute for the high-quality image. This ensures that the initial rendering of the page will display the blurry placeholders, while the full-quality images will be loaded later as they enter the viewport.

Additionally, using the `sizes` attribute (or [`data-sizes="auto"`](/guide/usage#auto-calculation-of-the-sizes-attribute) for automatic calculation) helps provide the search engine with information about the intended display size of the image. This enables search engines to select the most appropriate image source from the `srcset` attribute when indexing your website's content.
