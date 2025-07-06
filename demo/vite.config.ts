import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@owc/login-component': resolve(__dirname, '../dist/packages/login-component/index.js'),
      '@owc/shared': resolve(__dirname, '../dist/packages/shared/index.js')
    }
  }
}); 