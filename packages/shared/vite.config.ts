import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@owc/shared': resolve(__dirname, 'src/index.ts')
    }
  },
  server: {
    port: 3002,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  build: {
    outDir: '../../dist/packages/shared',
    lib: {
      entry: 'src/index.ts',
      name: 'OWCShared',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['ipfs-http-client'],
      output: {
        globals: {}
      }
    }
  },
  plugins: [
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ]
}); 