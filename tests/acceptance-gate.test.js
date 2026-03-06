// ABOUTME: Acceptance gate test — calls real Anthropic API via LangGraph journal generation.
// ABOUTME: Verifies generateJournalSections produces valid output with correct shape.

import { describe, it, expect } from 'vitest';
import { generateJournalSections } from '../src/generators/journal-graph.js';

const API_KEY_AVAILABLE = !!process.env.ANTHROPIC_API_KEY;

if (!API_KEY_AVAILABLE) {
  console.warn(
    '\n⚠️  ANTHROPIC_API_KEY not set — acceptance gate tests will be skipped.\n' +
    '   Run with: vals exec -f .vals.yaml -- npx vitest run tests/acceptance-gate.test.js\n',
  );
}

function _makeContext() {
  const sessions = new Map();
  sessions.set('session-1', [
    { type: 'user', content: 'Let me implement the retry logic for API calls', timestamp: '2026-03-06T10:00:00Z' },
    { type: 'assistant', content: 'I will add exponential backoff with a max of 3 retries', timestamp: '2026-03-06T10:00:05Z' },
    { type: 'user', content: 'Should we also handle rate limit errors differently?', timestamp: '2026-03-06T10:01:00Z' },
    { type: 'assistant', content: 'Yes, rate limit errors should use the Retry-After header value', timestamp: '2026-03-06T10:01:10Z' },
  ]);

  return {
    commit: {
      hash: 'abc123def456789',
      shortHash: 'abc123d',
      message: 'feat: add retry logic with exponential backoff',
      subject: 'feat: add retry logic with exponential backoff',
      author: 'Test User',
      authorEmail: 'test@example.com',
      timestamp: new Date('2026-03-06T10:15:32Z'),
      diff: [
        'diff --git a/src/api-client.js b/src/api-client.js',
        '--- a/src/api-client.js',
        '+++ b/src/api-client.js',
        '+async function fetchWithRetry(url, options, maxRetries = 3) {',
        '+  for (let attempt = 0; attempt < maxRetries; attempt++) {',
        '+    try {',
        '+      const response = await fetch(url, options);',
        '+      if (response.status === 429) {',
        '+        const retryAfter = response.headers.get("Retry-After") || Math.pow(2, attempt);',
        '+        await sleep(retryAfter * 1000);',
        '+        continue;',
        '+      }',
        '+      return response;',
        '+    } catch (err) {',
        '+      if (attempt === maxRetries - 1) throw err;',
        '+      await sleep(Math.pow(2, attempt) * 1000);',
        '+    }',
        '+  }',
        '+}',
      ].join('\n'),
      isMerge: false,
      parentCount: 1,
    },
    chat: {
      messages: [],
      sessions,
      messageCount: 4,
      sessionCount: 1,
    },
    metadata: {
      previousCommitTime: new Date('2026-03-06T09:00:00Z'),
      timeWindow: {
        start: new Date('2026-03-06T09:00:00Z'),
        end: new Date('2026-03-06T10:15:32Z'),
      },
      filterStats: {
        totalMessages: 8,
        filteredMessages: 4,
        preservedMessages: 4,
        substantialUserMessages: 4,
        filterReasons: { toolUse: 2, tooShort: 2 },
      },
      tokenEstimate: 3000,
      tokenBudget: { total: 150000 },
      sensitiveDataFilter: { totalRedactions: 0 },
    },
  };
}

describe.skipIf(!API_KEY_AVAILABLE)('Acceptance Gate — generateJournalSections', () => {
  it('generates all journal sections with correct shape', { timeout: 120_000 }, async () => {
    const context = _makeContext();

    const result = await generateJournalSections(context);

    // All section fields present
    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('dialogue');
    expect(result).toHaveProperty('technicalDecisions');
    expect(result).toHaveProperty('generatedAt');
    expect(result).toHaveProperty('errors');

    // Sections are non-empty strings (real content generated)
    expect(typeof result.summary).toBe('string');
    expect(result.summary.length).toBeGreaterThan(0);

    expect(typeof result.dialogue).toBe('string');
    expect(result.dialogue.length).toBeGreaterThan(0);

    expect(typeof result.technicalDecisions).toBe('string');
    expect(result.technicalDecisions.length).toBeGreaterThan(0);

    // Metadata
    expect(result.generatedAt).toBeInstanceOf(Date);
    expect(Array.isArray(result.errors)).toBe(true);
  });
});
