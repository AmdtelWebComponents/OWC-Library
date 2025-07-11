import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  // Development server configuration
  server: {
    port: 3001,
    open: true,
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  // Build configuration for library
  build: {
    outDir: '../../dist/packages/login-component',
    lib: {
      entry: 'src/index.ts',
      name: 'OWCLoginComponent',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['lit', 'ipfs-http-client'],
      output: {
        globals: {
          lit: 'Lit'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@owc/shared': resolve(__dirname, '../shared/src/index.ts')
    }
  },
  plugins: [
    wasm(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true
    })
  ]
}); 