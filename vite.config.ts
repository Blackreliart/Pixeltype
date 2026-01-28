import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    // Wichtig für GitHub Pages: Der Name deines Repositories
    base: '/Pixeltype/', 
    
    server: {
      port: 3000,
      strictPort: false,
      host: true,
    },
    plugins: [react()],
    resolve: {
      alias: {
        // Nutzt einen sichereren Weg für Pfad-Aliase in ESM Umgebungen
        '@': path.resolve(new URL('.', import.meta.url).pathname, '.'),
      },
    },
  };
});
