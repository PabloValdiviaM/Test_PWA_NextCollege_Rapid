import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base must match the subroute /app/ where Express serves the PWA
export default defineConfig({
  plugins: [react()],
  base: '/app/'
});
