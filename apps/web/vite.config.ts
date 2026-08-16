import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { devtools } from '@tanstack/devtools-vite'
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import { cloudflare } from '@cloudflare/vite-plugin'
// import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ['react', 'react-dom'],
  },
  plugins: [
    devtools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    // babel({ presets: [reactCompilerPreset()] }),
  ],
})

export default config
