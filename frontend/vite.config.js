import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/images': 'http://localhost:3002',  // Proxy image requests to your backend
      // You can add more paths here if needed, e.g., API endpoints:
      // '/api': 'http://localhost:3002',
    },
  },
});
