import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    css: true
codex/implement-task-management-integration-feature
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    globals: true,
    css: true
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
main
  }
});
