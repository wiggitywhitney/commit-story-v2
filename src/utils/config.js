// ABOUTME: Centralizes environment variable configuration for commit-story
// ABOUTME: Loads and validates required config (API keys, model, journal settings, auto-summarize)

import 'dotenv/config';

// Validate required config before creating frozen object
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

export const config = Object.freeze({
  anthropicApiKey,
  model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
  journalDir: process.env.JOURNAL_DIR || './journal',
  autoSummarize: process.env.COMMIT_STORY_AUTO_SUMMARIZE?.trim().toLowerCase() !== 'false',
  timezone: process.env.COMMIT_STORY_TIMEZONE || null,
});
