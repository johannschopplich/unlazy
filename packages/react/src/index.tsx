import React, { useEffect, useRef } from 'react'
import type { ImgHTMLAttributes } from 'react'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props extends ImgHTMLAttributes<HTMLImageElement>, Pick<UnLazyLoadOptions, 'blurhashSize'> {
  autoSizes?: boolean
  blurhash?: string
}

export function LazyImage({ autoSizes, blurhash, blurhashSize }: Props) {
  const target = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (target.current) {
      const cleanup = lazyLoad(target.current, { blurhashSize })
      return () => {
        cleanup()
      }
    }
  }, [])

  return (
    <img
      ref={target}
      data-blurhash={blurhash}
      data-sizes={autoSizes ? 'auto' : undefined}
      loading="lazy"
    />
  )
}
