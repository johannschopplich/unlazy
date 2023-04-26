// The Nuxt module builder compiles `<script lang="ts">` to `<script>`, which
// is a problem if the component also has a `<script lang="ts" setup>` block.
// This leads to a Vite error:
// `[@vue/compiler-sfc] <script> and <script setup> must have the same language type.`
// So we manually add the `lang="ts"` attribute to the `<script>` block.

import { join } from 'node:path'
import { readFileSync, unlinkSync, writeFileSync } from 'node:fs'

const distDir = new URL('../dist', import.meta.url).pathname
const files = [
  'runtime/components/UnLazyImage.vue',
]

for (const file of files) {
  const filePath = join(distDir, file)
  const content = readFileSync(filePath, 'utf-8')
  const newContent = content.replace(/<script>\n/, '<script lang="ts">\n')
  writeFileSync(filePath, newContent)

  // Remove UnLazyImage.vue.d.ts
  const dtsPath = `${filePath}.d.ts`
  try {
    unlinkSync(dtsPath)
  }
  catch (err) {
    if (err.code !== 'ENOENT')
      throw err
  }
}
