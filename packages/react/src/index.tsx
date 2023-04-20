import { useEffect, useRef } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'blurhashSize'> {
  autoSizes?: boolean
  blurhash?: string
}

export function UnLazyImage({
  autoSizes,
  blurhash,
  blurhashSize,
  ...rest
}: Props) {
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (target.current) {
      const cleanup = lazyLoad(target.current, {
        blurhash,
        blurhashSize,
      })
      return () => {
        cleanup()
      }
    }
  }, [blurhash, blurhashSize])

  return (
    <img
      ref={target}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...rest}
    />
  )
}
