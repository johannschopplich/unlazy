import { autoSizes, lazyLoad, loadImage, triggerLoad } from '../../../core/src'

export { autoSizes, lazyLoad, loadImage, triggerLoad } from '../../../core/src'

// Default export for IIFE bundle
export default Object.freeze({
  autoSizes,
  lazyLoad,
  loadImage,
  triggerLoad,
})

// Automatically initiate if `init` attribute is present
if (document.currentScript?.hasAttribute('init'))
  lazyLoad()
