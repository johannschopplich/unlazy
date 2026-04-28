import type { ImgHTMLAttributes } from 'react'
import type { UnLazyLoadOptions, UnLazySource } from 'unlazy'
import { useEffect, useRef } from 'react'
import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'

interface Props
  extends ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** Image source URL to be lazy-loaded. */
  src?: ImgHTMLAttributes<HTMLImageElement>['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: ImgHTMLAttributes<HTMLImageElement>['srcSet']
  /** Image source URLs for different resolutions. This will render the `<picture>` element instead of `<img>`. */
  sources?: UnLazySource[]
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /** Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. */
  placeholderSrc?: string
  /**
   * A flag to indicate whether the image should be preloaded, even if it is not in the viewport yet.
   * @default false
   */
  preload?: boolean
  /**
   * Allows to specify the loading strategy of the image.
   * @default 'lazy'
   */
  loading?: ImgHTMLAttributes<HTMLImageElement>['loading']
  /** A callback function to run when the image is loaded. */
  onImageLoad?: (image: HTMLImageElement) => void
  /** A callback function to run when the image fails to load. */
  onImageError?: (image: HTMLImageElement, error: Event) => void
}

export function UnLazyImage({
  src,
  srcSet,
  sources,
  autoSizes,
  blurhash,
  thumbhash,
  placeholderSrc,
  placeholderSize,
  preload = false,
  loading = 'lazy',
  onImageLoad,
  onImageError,
  ...rest
}: Props) {
  const targetRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!targetRef.current)
      return

    if (preload) {
      const cleanupSizes = autoSizes
        ? _autoSizes(targetRef.current, { updateOnResize: true })
        : undefined
      const cleanupLoad = triggerLoad(targetRef.current, { onImageLoad, onImageError })
      return () => {
        cleanupSizes?.()
        cleanupLoad()
      }
    }

    const cleanup = lazyLoad(targetRef.current, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
      updateSizesOnResize: autoSizes,
      onImageLoad,
      onImageError,
    })
    return () => {
      cleanup()
    }
  }, [src, srcSet, sources, autoSizes, blurhash, thumbhash, placeholderSrc, placeholderSize, preload, onImageLoad, onImageError])

  const img = (
    <img
      ref={targetRef}
      src={placeholderSrc}
      data-src={src}
      data-srcset={srcSet}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading={loading}
      {...rest}
    />
  )

  if (!sources?.length)
    return img

  return (
    <picture>
      {sources.map((source, index) => (
        <source
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          type={source.type}
          media={source.media}
          width={source.width}
          height={source.height}
          data-srcset={source.srcSet}
          data-sizes={source.sizes || (autoSizes ? 'auto' : undefined)}
        />
      ))}
      {img}
    </picture>
  )
}
