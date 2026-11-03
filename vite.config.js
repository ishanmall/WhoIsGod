import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Group 3D rendering libraries into one cacheable chunk
            if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
              return 'three-vendor';
            }
            // Group Framer Motion
            if (id.includes('framer-motion')) {
              return 'framer-vendor';
            }
            // Group React and DOM essentials
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            // Group Icons
            if (id.includes('lucide-react')) {
              return 'lucide-vendor';
            }
            // Fallback for all other dependencies
            return 'vendor';
          }
        }
      }
    }
  }
});