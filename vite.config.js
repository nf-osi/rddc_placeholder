import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rddc_placeholder/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
