# SEO Considerations

Search engine bots and crawlers don't behave like human visitors: Googlebot supports native `loading="lazy"` but [does not scroll the page](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading), and most social scrapers (Slackbot, Twitterbot, facebookexternalhit) don't run JavaScript at all. For crawlers that do, unlazy detects them and loads the full-quality image immediately, so the blurry placeholder isn't what gets indexed.

## Crawlers Get the Real Image

unlazy exports an `isCrawler` constant that is `true` when the current visitor is detected as a bot or crawler. For a crawler, `data-src` and `data-srcset` become `src` and `srcset` immediately, so the full-quality image is what gets indexed.

Use the `sizes` attribute (or [`data-sizes="auto"`](/guide/usage#calculate-the-sizes-attribute-automatically) for automatic calculation) to provide search engines with the intended display size.
