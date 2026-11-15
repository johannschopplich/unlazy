import type { ImgHTMLAttributes } from 'react'
import type { TriggerLoadOptions, UnLazyImageProps } from 'unlazy'
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { lazyLoad, resolveImageAttributes } from 'unlazy'

export type { UnLazySource } from 'unlazy'

interface Props
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, keyof UnLazyImageProps>,
  UnLazyImageProps,
  TriggerLoadOptions {}

// React 18 warns about `useLayoutEffect` during server rendering.
const useIsomorphicLayoutEffect = typeof document === 'undefined'
  ? useEffect
  : useLayoutEffect

// eslint-disable-next-line react/no-forward-ref -- React 18 passes a `ref` to a function component only through `forwardRef`.
export const UnLazyImage = forwardRef<HTMLImageElement, Props>((props, forwardedRef) => {
  const {
    src,
    srcSet,
    sources,
    autoSizes,
    blurhash,
    thumbhash,
    placeholderSrc,
    placeholderSize,
    preload,
    loading,
    onImageLoad,
    onImageError,
    ...rest
  } = props
  const targetRef = useRef<HTMLImageElement | null>(null)
  const callbacksRef = useRef({ onImageLoad, onImageError })
  const { image, sources: sourceAttributes, lazyLoadOptions, loadKey } = resolveImageAttributes(props)

  useIsomorphicLayoutEffect(() => {
    callbacksRef.current = { onImageLoad, onImageError }
  })

  useEffect(() => {
    if (!targetRef.current)
      return

    return lazyLoad(targetRef.current, {
      ...lazyLoadOptions,
      onImageLoad: image => callbacksRef.current.onImageLoad?.(image),
      onImageError: (image, error) => callbacksRef.current.onImageError?.(image, error),
    })
  // eslint-disable-next-line react/exhaustive-deps -- `loadKey` changes with `lazyLoadOptions`, which is a new object on every render.
  }, [loadKey])

  const setRefs = useCallback((image: HTMLImageElement | null) => {
    targetRef.current = image
    if (typeof forwardedRef === 'function')
      forwardedRef(image)
    else if (forwardedRef)
      forwardedRef.current = image
  }, [forwardedRef])

  const img = (
    <img
      {...rest}
      ref={setRefs}
      {...toReactAttributes(image)}
    />
  )

  if (!sources?.length)
    return img

  return (
    <picture>
      {sourceAttributes.map((attributes, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <source key={index} {...toReactAttributes(attributes)} />
      ))}
      {img}
    </picture>
  )
})

function toReactAttributes<T extends { srcset?: string }>({ srcset, ...attributes }: T) {
  return { ...attributes, srcSet: srcset }
}
