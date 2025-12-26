import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/3DGlobalBuildingAtlas/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split large mapping libraries into separate chunks
          if (id.includes('node_modules/maplibre-gl')) {
            return 'maplibre';
          }
          if (id.includes('node_modules/@deck.gl')) {
            return 'deckgl';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
        }
      }
    }
  }
})
