# Aspect Ratio for Blurry Placeholders

When using blurry placeholders without explicit `width` and `height` attributes, the browser doesn't know the image dimensions until it loads, causing Cumulative Layout Shift (CLS). Setting the `aspect-ratio` CSS property reserves the correct space before the full-quality image loads.

This technique is especially important for:

- Preventing CLS and improving Core Web Vitals scores
- Maintaining consistent layouts during image loading
- Supporting responsive images where dimensions vary by viewport

## Usage

Calculate the aspect ratio using the dimensions of the full-quality image (width / height) and apply it to the `<img>` tag:

```html
<img
  src="data:image/svg+xml, ..."
  loading="lazy"
  data-srcset="/foo.png 1024w, /foo-2x.png 2048w"
  data-sizes="auto"
  width="1600"
  height="900"
  style="aspect-ratio: 16/9;"
>
```
