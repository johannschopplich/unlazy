import DefaultTheme from 'vitepress/theme'
import CdnLink from './components/CdnLink.vue'
import './main.css'
import './vars.css'

import 'uno.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component('CdnLink', CdnLink)
  },
}
