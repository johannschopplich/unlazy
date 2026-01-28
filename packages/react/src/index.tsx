import type { ImgHTMLAttributes } from 'react'
import type { UnLazyLoadOptions } from 'unlazy'
import { useEffect, useRef } from 'react'
import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'

interface Props
  extends ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** Image source URL to be lazy-loaded. */
  src?: ImgHTMLAttributes<HTMLImageElement>['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: ImgHTMLAttributes<HTMLImageElement>['srcSet']
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
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!target.current)
      return

    if (preload) {
      if (autoSizes)
        _autoSizes(target.current)
      triggerLoad(target.current, onImageLoad, onImageError)
      return
    }

    const cleanup = lazyLoad(target.current, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
      onImageLoad,
      onImageError,
    })

    return () => {
      cleanup()
    }
  }, [src, srcSet, autoSizes, blurhash, thumbhash, placeholderSrc, placeholderSize, preload, onImageLoad, onImageError])

  return (
    <img
      ref={target}
      src={placeholderSrc}
      data-src={src}
      data-srcset={srcSet}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading={loading}
      {...rest}
    />
  )
}
