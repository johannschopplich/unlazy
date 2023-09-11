# Aspect Ratio for Blurry Placeholders

In certain cases, the blurry placeholder might not have the full image width and height. To ensure that the layout does not change when the full-quality image loads and to maintain a consistent user experience, you can add the `aspect-ratio` CSS property to the `style` attribute to your images.

By setting the aspect ratio for your blurry placeholders, you can:

- Prevent layout shifts as the full-quality image loads.
- Ensure that the image container maintains its dimensions even before the full-quality image is loaded.

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
