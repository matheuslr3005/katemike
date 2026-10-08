import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // Relative base so the build works under /<repo>/ on GitHub Pages and at a domain root.
  base: './',
  plugins: [react()],
  server: { host: true },
})
