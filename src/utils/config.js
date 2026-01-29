import 'dotenv/config';

// Validate required config before creating frozen object
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}

export const config = Object.freeze({
  anthropicApiKey,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
  journalDir: process.env.JOURNAL_DIR || './journal',
});
