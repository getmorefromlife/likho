import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !dep.includes('prosody-lexicon') && !dep.includes('qaafiyah-vocab')),
    },
    chunkSizeWarningLimit: 4500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('aruuz-dictionary.json') ||
            id.includes('aruuz-quarantine.json')
          ) {
            return 'prosody-lexicon';
          }
          if (
            id.includes('qaafiyahDataset.json') ||
            id.includes('qaafiyahVocabulary.json')
          ) {
            return 'qaafiyah-vocab';
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

