import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'

export default defineConfig({
  plugins: [svelte()],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    emptyOutDir: true
  }
})