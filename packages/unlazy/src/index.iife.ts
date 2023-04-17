import { autoSizes, lazyLoad, loadImage } from '@unlazy/core'

// Default export for IIFE bundle
export default Object.freeze({
  lazyLoad,
  autoSizes,
  loadImage,
})

// Automatically initiate if `init` attribute is present
if (document.currentScript?.hasAttribute('init'))
  lazyLoad()
