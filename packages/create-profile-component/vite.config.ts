import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AmdtelCreateProfileComponent',
      fileName: 'index',
      formats: ['es', 'umd']
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3003,
    open: true,
    watch: {
      usePolling: true
    }
  }
});
