import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Vitest config moved to vitest.config.ts for production build compatibility

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
