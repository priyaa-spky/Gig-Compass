import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Builds everything (JS + CSS) into one dist/index.html that works when double-clicked.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
});
