import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  esbuild: {
    legalComments: 'none',
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes('sovereign-prosody-lexicon')),
    },
    sourcemap: false,
    chunkSizeWarningLimit: 7500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('sovereign-scansion.json') ||
            id.includes('sovereign-quarantine.json')
          ) {
            return 'sovereign-prosody-lexicon';
          }
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});

