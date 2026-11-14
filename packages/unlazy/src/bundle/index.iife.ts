import { lazyLoad } from '../lazyLoad'

export { autoSizes, lazyLoad, triggerLoad } from '../lazyLoad'

// Automatically initiate if `init` attribute is present.
if (document.currentScript?.hasAttribute('init'))
  lazyLoad()
