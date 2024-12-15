
import { defineConfig } from 'vite';
import json from '@rollup/plugin-json';

// ...existing code...

export default defineConfig({
  plugins: [
    // ...existing plugins...
    json()
  ],
  // ...existing code...
});