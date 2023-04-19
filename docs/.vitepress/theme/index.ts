import DefaultTheme from 'vitepress/theme'
import './main.css'
import './vars.css'
import 'uno.css'

import CdnLink from './components/CdnLink.vue'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    ctx.app.component('CdnLink', CdnLink)
  },
}
