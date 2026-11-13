# SEO Considerations

Search engine bots and crawlers don't behave like human visitors: Googlebot supports native `loading="lazy"` but [does not scroll the page](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading), and most social scrapers (Slackbot, Twitterbot, facebookexternalhit) don't run JavaScript at all. For crawlers that do, unlazy detects them and loads the full-quality image immediately, so the blurry placeholder isn't what gets indexed.

## Crawlers Get the Real Image

unlazy exports an `isCrawler` constant that indicates whether the current visitor is detected as a bot or crawler, ensuring full-quality images are loaded and indexed by search engines.

The detection mechanism works by:

1. **User Agent Check**: Scans for common bot identifiers (e.g., `bot`, `crawler`, `spider`, `googlebot`).
2. **onscroll Support Detection**: Checks if the browser supports the `onscroll` event, which is typically absent in headless browsers and crawlers.
3. **Immediate Loading**: If detected as a crawler, `data-srcset` and `data-src` attributes are immediately converted to their standard counterparts.

The library trusts that bots and crawlers can evaluate the `srcset` attribute and select appropriate image sources for indexing.

Use the `sizes` attribute (or [`data-sizes="auto"`](/guide/usage#calculate-the-sizes-attribute-automatically) for automatic calculation) to provide search engines with the intended display size.
