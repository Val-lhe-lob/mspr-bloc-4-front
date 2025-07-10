import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/users': {
        target: 'http://localhost:5004',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/users/, '/api'),
      },
      '/api/apimonitoring': {
        target: 'http://localhost:5005',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/apimonitoring/, '/api/ApiMonitoring'),
      },
      '/api/products': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/products/, '/api/Products'),
      },
      '/api/commandes': {
          target: 'http://localhost:5002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/commandes/, '/api/Commandes'),
      },
      '/api/produitcommandes': {
          target: 'http://localhost:5002',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/produitcommandes/, '/api/ProduitCommandes'),
      },

      '/api/clients': {
        target: 'http://localhost:5003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/clients/, '/api/Clients'),
    },
    },
  },
});
