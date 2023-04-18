# SEO Considerations

When implementing lazy loading with blurry placeholders, it is important to consider the impact it may have on SEO. Search engine bots and crawlers are responsible for indexing and ranking your website's content, and they might not always behave like human visitors when browsing the site. unlazy ensures that your website's images are indexed correctly and that their quality is not negatively affected by the use of blurry placeholders.

## Detects Bots and Crawlers

unlazy provided includes an exported function called `isCrawler` that detects if the visitor is a bot or a crawler. This is useful to ensure that the full-quality image is loaded and indexed by search engines. The library trusts that bots and crawlers can evaluate the `srcset` attribute and load the appropriate image based on their needs.

The `isCrawler` function checks the user agent string for common bot and crawler identifiers and determines if the `onscroll` event is supported by the browser. This information is then used to decide whether to immediately load the full-quality image or to use the blurry placeholder approach for the specific visitor.

## Use `src`, `data-srcset`, and `sizes` Attributes

When using blurry placeholders, it is important to set the `src` attribute with the blurry placeholder image and use the `data-srcset` attribute for the high-quality image. This ensures that the initial rendering of the page will display the blurry placeholders, while the full-quality images will be loaded later as they enter the viewport.

Additionally, using the `sizes` attribute (or `data-sizes="auto"` for automatic calculation) helps provide the search engine with information about the intended display size of the image. This enables search engines to select the most appropriate image source from the `srcset` attribute when indexing your website's content.
