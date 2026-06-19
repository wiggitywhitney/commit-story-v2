// ABOUTME: Tests for src/utils/config.js
// ABOUTME: Verifies env var loading, normalization, and defaults

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, ANTHROPIC_API_KEY: 'test-key' };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  describe('autoSummarize', () => {
    it('defaults to true when env var is not set', async () => {
      delete process.env.COMMIT_STORY_AUTO_SUMMARIZE;
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(true);
    });

    it('is true when set to anything other than false', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = 'true';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(true);
    });

    it('is false when set to exact string "false"', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = 'false';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(false);
    });

    it('is false when set to "FALSE"', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = 'FALSE';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(false);
    });

    it('is false when set to "False"', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = 'False';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(false);
    });

    it('is false when set to " false " with surrounding whitespace', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = ' false ';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(false);
    });

    it('is false when set to " FALSE " with surrounding whitespace', async () => {
      process.env.COMMIT_STORY_AUTO_SUMMARIZE = ' FALSE ';
      const { config } = await import('../../src/utils/config.js');
      expect(config.autoSummarize).toBe(false);
    });
  });
});
