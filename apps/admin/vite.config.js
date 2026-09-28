import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base must match the subroute /admin/ where Express serves the admin dashboard
export default defineConfig({
  plugins: [react()],
  base: '/admin/'
});
