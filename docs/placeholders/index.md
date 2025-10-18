# Placeholder Images

The primary goal of unlazy is to provide a smooth transition from a placeholder image to the actual image. A common approach is to use a blurry version of the actual image as a placeholder.

Inlining a blurry placeholder is not always practical, e.g. when loading images from a CDN. In this case, you can use [hash-based placeholders](/placeholders/hash-based) like BlurHash or ThumbHash. Both are compact string representations of placeholder images.

unlazy supports the following hash-based formats:

- **[BlurHash](/placeholders/hash-based#blurhash)** – Compact string representation with good blur quality
- **[ThumbHash](/placeholders/hash-based#thumbhash)** – More compact with better quality and automatic aspect ratio encoding

Learn more about [hash-based placeholders](/placeholders/hash-based).
