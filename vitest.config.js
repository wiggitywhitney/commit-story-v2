// ABOUTME: Vitest configuration — test file discovery and coverage settings
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file discovery
    include: ['tests/**/*.test.js'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: [],
    },
  },
});
