import { useEffect, useRef } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /**
   * A flag to indicate whether the image should be loaded immediately.
   * @default false
   */
  immediate?: boolean
}

export function UnLazyImage({
  autoSizes,
  blurhash,
  thumbhash,
  placeholderSize,
  immediate,
  ...rest
}: Props) {
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (target.current) {
      const cleanup = lazyLoad(target.current, {
        hash: thumbhash || blurhash,
        hashType: thumbhash ? 'thumbhash' : 'blurhash',
        placeholderSize,
        immediate,
      })
      return () => {
        cleanup()
      }
    }
  }, [blurhash, thumbhash, placeholderSize, immediate])

  return (
    <img
      ref={target}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...rest}
    />
  )
}
