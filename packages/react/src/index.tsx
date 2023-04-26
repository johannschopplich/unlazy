import { useEffect, useRef } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

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
}

export function UnLazyImage({
  src,
  srcSet,
  autoSizes,
  blurhash,
  thumbhash,
  placeholderSrc,
  placeholderSize,
  ...rest
}: Props) {
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (!target.current)
      return

    const cleanup = lazyLoad(target.current, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
    })

    return () => {
      cleanup()
    }
  }, [src, srcSet, autoSizes, blurhash, thumbhash, placeholderSrc, placeholderSize])

  return (
    <img
      ref={target}
      src={placeholderSrc}
      data-src={src}
      data-srcset={srcSet}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...rest}
    />
  )
}
