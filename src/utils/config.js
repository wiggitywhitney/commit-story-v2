import 'dotenv/config';

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
  journalDir: process.env.JOURNAL_DIR || './journal',
};

// Validate required config
if (!config.anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}
