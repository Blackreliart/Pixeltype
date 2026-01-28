import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    // Wichtig für GitHub Pages: Der Name deines Repositories
    base: '/Pixeltype/', 
    
    server: {
      port: 3000,
      strictPort: false,
      host: true,
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(new URL('.', import.meta.url).pathname, '.'),
      },
    },
  };
});
