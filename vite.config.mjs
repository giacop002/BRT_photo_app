import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import preprocess from 'svelte-preprocess'
import path from 'node:path'

export default defineConfig({
  plugins: [svelte({
    preprocess: preprocess()
  })],
  root: 'src/renderer',
  base: './',
  build: {
    outDir: path.resolve(process.cwd(), 'dist'),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})