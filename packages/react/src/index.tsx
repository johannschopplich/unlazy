import { useEffect, useRef } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** A flag to indicate whether the sizes attribute should be automatically calculated. */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
}

export function UnLazyImage({
  autoSizes,
  blurhash,
  thumbhash,
  placeholderSize,
  ...rest
}: Props) {
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (target.current) {
      const cleanup = lazyLoad(target.current, {
        hash: thumbhash || blurhash,
        hashType: thumbhash ? 'thumbhash' : 'blurhash',
        placeholderSize,
      })
      return () => {
        cleanup()
      }
    }
  }, [thumbhash, blurhash, placeholderSize])

  return (
    <img
      ref={target}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...rest}
    />
  )
}
