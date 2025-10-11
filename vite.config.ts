import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
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
