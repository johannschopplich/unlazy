import type { PresetOptions } from 'tsup-preset-solid'
import { defineConfig } from 'tsup'
import { generateTsupOptions, parsePresetOptions } from 'tsup-preset-solid'

const presetOptions: PresetOptions = {
  entries: [{ entry: 'src/index.tsx' }],
}

export default defineConfig(() => {
  const resolvedOptions = parsePresetOptions(presetOptions)
  return generateTsupOptions(resolvedOptions)
})
