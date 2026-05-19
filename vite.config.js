import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Prevent Vite from obscuring Rust errors
  clearScreen: false,
  // Tauri expects a fixed port
  server: {
    port: 1420,
    strictPort: true,
  },
  // Make env variables available to Tauri
  envPrefix: ['VITE_', 'TAURI_'],
});