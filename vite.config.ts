
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // This is crucial for GitHub Pages. 
  // It ensures assets are loaded from './assets' instead of '/assets'
  base: './', 
  build: {
    outDir: 'dist',
  }
});
