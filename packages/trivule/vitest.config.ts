import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    bail: 1,
    coverage: {
      provider: 'v8',
    },
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
