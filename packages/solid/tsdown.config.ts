import { defineConfig } from 'tsdown'
import solid from 'unplugin-solid/rolldown'

export default defineConfig([
  {
    entry: ['./src/index.tsx'],
    platform: 'neutral',
    clean: true,
    plugins: [
      solid(),
    ],
  },
  // The `solid` export condition serves the JSX as written, with `jsx:
  // "preserve"` from the tsconfig, so the consumer's Solid compiler can build
  // it for the server or the browser.
  {
    entry: ['./src/index.tsx'],
    platform: 'neutral',
    clean: false,
    dts: false,
    outExtensions: () => ({ js: '.jsx' }),
  },
])
