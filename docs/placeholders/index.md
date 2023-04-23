# Placeholder Images

The primary goal of unlazy is to provide a smooth transition from a placeholder image to the actual image. A common approach is to use a blurred version of the actual image as a placeholder.

Inlining a blurred version of the actual image is not always possible, e.g. when the image is loaded from a CDN. In this case, you can use a [BlurHash](/placeholders/blurhash) or [ThumbHash](/placeholders/thumbhash) placeholder instead. Both are very compact representations of a placeholder for an image.

The following placeholder formats are supported:

- [BlurHash](/placeholders/blurhash)
- [ThumbHash](/placeholders/thumbhash)
