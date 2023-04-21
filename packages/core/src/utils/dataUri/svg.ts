const uriCharReplacements: Record<string, string> = {
  '%2F': '/',
  '%3A': ':',
  '%3D': '=',
}

/**
 * Generates an SVG with a Gaussian blur filter applied to the given image URI.
 * The resulting SVG serves as a blurry placeholder for the image.
 */
export function createBlurryImageSvg(imageUri: string, width: number, height: number) {
  // Wrap the blurred image in a SVG to avoid rasterizing the filter
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width.toFixed(2)} ${height.toFixed(2)}">
  <filter id="a" color-interpolation-filters="sRGB">
    <feGaussianBlur stdDeviation=".2"></feGaussianBlur>
    <feComponentTransfer>
      <feFuncA type="discrete" tableValues="1 1"></feFuncA>
    </feComponentTransfer>
  </filter>
  <image filter="url(#a)" x="0" y="0" width="100%" height="100%" href="${imageUri}"></image>
</svg>`.trimStart()
}

/**
 * Optimizes the input SVG string and encodes it as a URI-encoded data URI.
 * This function is useful for creating optimized and compliant SVG data URIs.
 */
export function svgToDataUri(svg: string) {
  let optimizedSvg = svg.trim()

  // Optimizes the SVG string by deleting line breaks and removing unnecessary spaces
  optimizedSvg = optimizedSvg.replace(/\s+/g, ' ').replace(/>\s+</g, '><')

  // URI-encode the SVG string
  let uri = encodeURIComponent(optimizedSvg)

  // Back-decode certain characters to improve compression,
  // except '%20' to be compliant with W3C guidelines
  uri = uri.replace(/%2F|%3A|%3D/g, char => uriCharReplacements[char])

  return `data:image/svg+xml,${uri}`
}
