import type { ImgHTMLAttributes, SyntheticEvent } from 'react'
import type { TriggerLoadOptions, UnLazyImageProps } from 'unlazy'
import { forwardRef, useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import { lazyLoad, reportImageOutcome, resolveImageAttributes } from 'unlazy'

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
    onLoad,
    onError,
    ...rest
  } = props
  const targetRef = useRef<HTMLImageElement | null>(null)
  const callbacksRef = useRef({ onImageLoad, onImageError })
  const { hasRealSources, image, sources: sourceAttributes, sourcesKey, hash, hashType } = resolveImageAttributes(props)

  useIsomorphicLayoutEffect(() => {
    callbacksRef.current = { onImageLoad, onImageError }
  })

  useEffect(() => {
    if (!targetRef.current || hasRealSources)
      return

    return lazyLoad(targetRef.current, {
      hash,
      hashType,
      placeholderSize,
      updateSizesOnResize: autoSizes,
      preload,
      onImageLoad: image => callbacksRef.current.onImageLoad?.(image),
      onImageError: (image, error) => callbacksRef.current.onImageError?.(image, error),
    })
  }, [
    src,
    srcSet,
    sourcesKey,
    autoSizes,
    hash,
    hashType,
    placeholderSize,
    preload,
    hasRealSources,
  ])

  const setRefs = useCallback((image: HTMLImageElement | null) => {
    targetRef.current = image
    if (typeof forwardedRef === 'function')
      forwardedRef(image)
    else if (forwardedRef)
      forwardedRef.current = image
  }, [forwardedRef])

  // `lazyLoad` reports the outcome of the images it swaps; an image with its
  // real sources in the markup reports its own.
  const handleOutcome = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    if (event.type === 'error')
      onError?.(event)
    else
      onLoad?.(event)
    if (hasRealSources)
      reportImageOutcome(event.currentTarget, event.nativeEvent, { onImageLoad, onImageError })
  }

  const img = (
    <img
      {...rest}
      ref={setRefs}
      {...toReactAttributes(image)}
      onLoad={handleOutcome}
      onError={handleOutcome}
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
