import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        sourceMap: true, // Kích hoạt source map
      },
    },
  },
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.mp4'],
})
