import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [
    solid(),
  ],

  resolve: {
    tsconfigPaths: true,
  },
})
