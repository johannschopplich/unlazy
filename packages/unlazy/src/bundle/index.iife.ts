import { lazyLoad } from '../../../core/src'

export { autoSizes, lazyLoad, triggerLoad } from '../../../core/src'

// Automatically initiate if `init` attribute is present
if (document.currentScript?.hasAttribute('init'))
  lazyLoad()
