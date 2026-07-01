import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    // Playwright specs live in e2e/ and run via `npm run test:e2e`.
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
