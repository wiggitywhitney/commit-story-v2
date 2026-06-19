// ABOUTME: Tests for summary-graph.js — daily summary generation pipeline
// ABOUTME: Contract tests mock ChatAnthropic; unit tests cover deterministic helpers

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the LLM provider before importing the module under test.
const mockInvoke = vi.fn();
vi.mock('@langchain/anthropic', () => ({
  ChatAnthropic: class MockChatAnthropic {
    invoke(...args) {
      return mockInvoke(...args);
    }
  },
}));

// Mock logger to assert info calls at span sites.
vi.mock('../../src/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}));

import {
  generateDailySummary,
  dailySummaryNode,
  formatEntriesForSummary,
  cleanDailySummaryOutput,
  resetModel,
  SummaryState,
} from '../../src/generators/summary-graph.js';
import logger from '../../src/logger.js';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

function _makeEntries(count = 3) {
  const entries = [];
  for (let i = 0; i < count; i++) {
    entries.push(`## 10:${String(i).padStart(2, '0')}:00 AM CDT — abc${i}

### Summary
The developer implemented feature ${i}.

### Development Dialogue
> **Human:** "How should we handle this?"
> **Assistant:** "Here's one approach..."

### Technical Decisions
- **DECISION: Use pattern ${i}** (Implemented)
  - Clean separation of concerns

═══════════════════════════════════════`);
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Deterministic helpers
// ---------------------------------------------------------------------------

describe('formatEntriesForSummary', () => {
  it('joins entries with separator and adds count header', () => {
    const entries = _makeEntries(2);
    const result = formatEntriesForSummary(entries);

    expect(result).toContain('2 journal entries');
    expect(result).toContain('Entry 1 of 2');
    expect(result).toContain('Entry 2 of 2');
    expect(result).toContain('feature 0');
    expect(result).toContain('feature 1');
  });

  it('handles single entry', () => {
    const entries = _makeEntries(1);
    const result = formatEntriesForSummary(entries);

    expect(result).toContain('1 journal entry');
    expect(result).toContain('Entry 1 of 1');
  });

  it('returns empty message for no entries', () => {
    const result = formatEntriesForSummary([]);
    expect(result).toContain('No journal entries');
  });
});

describe('cleanDailySummaryOutput', () => {
  it('returns raw output when it contains all three sections', () => {
    const output = `## Narrative

The developer worked on features.

## Key Decisions

- Used pattern A for clarity

## Open Threads

- Still need to add tests`;

    expect(cleanDailySummaryOutput(output)).toBe(output);
  });

  it('strips preamble before ## Narrative', () => {
    const output = `Here's a summary of the day's work:

## Narrative

The developer worked on features.

## Key Decisions

No key decisions documented today.

## Open Threads

No open threads identified.`;

    const cleaned = cleanDailySummaryOutput(output);
    expect(cleaned).toMatch(/^## Narrative/);
    expect(cleaned).not.toContain("Here's a summary");
  });

  it('replaces banned words', () => {
    const output = `## Narrative

The developer implemented a comprehensive and robust solution.

## Key Decisions

No key decisions documented today.

## Open Threads

No open threads identified.`;

    const cleaned = cleanDailySummaryOutput(output);
    expect(cleaned).not.toMatch(/comprehensive/i);
    expect(cleaned).not.toMatch(/robust/i);
  });

  it('returns null/empty input as-is', () => {
    expect(cleanDailySummaryOutput(null)).toBeNull();
    expect(cleanDailySummaryOutput('')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// LLM boundary (node) tests
// ---------------------------------------------------------------------------

describe('dailySummaryNode', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
  });

  it('sends entries to LLM and returns parsed sections', async () => {
    const llmOutput = `## Narrative

The developer built three features today.

## Key Decisions

- Chose pattern A for simplicity

## Open Threads

- Tests still needed`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const entries = _makeEntries(3);
    const result = await dailySummaryNode({ entries, date: '2026-02-22' });

    expect(result.narrative).toContain('built three features');
    expect(result.keyDecisions).toContain('pattern A');
    expect(result.openThreads).toContain('Tests still needed');
    expect(result.errors).toEqual([]);

    // Verify LLM was called with system + human messages
    expect(mockInvoke).toHaveBeenCalledOnce();
    const [messages] = mockInvoke.mock.calls[0];
    expect(messages).toHaveLength(2);
  });

  it('returns early with message when no entries provided', async () => {
    const result = await dailySummaryNode({ entries: [], date: '2026-02-22' });

    expect(result.narrative).toContain('No journal entries');
    expect(result.keyDecisions).toBe('');
    expect(result.openThreads).toBe('');
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('handles LLM errors gracefully', async () => {
    mockInvoke.mockRejectedValue(new Error('API rate limited'));

    const entries = _makeEntries(1);
    const result = await dailySummaryNode({ entries, date: '2026-02-22' });

    expect(result.narrative).toContain('failed');
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toContain('rate limited');
  });

  it('handles LLM output missing sections', async () => {
    mockInvoke.mockResolvedValue({ content: 'Just some text without proper sections' });

    const entries = _makeEntries(2);
    const result = await dailySummaryNode({ entries, date: '2026-02-22' });

    // Should still return something without crashing
    expect(result).toHaveProperty('narrative');
    expect(result).toHaveProperty('keyDecisions');
    expect(result).toHaveProperty('openThreads');
    expect(result.errors).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// End-to-end (graph execution)
// ---------------------------------------------------------------------------

describe('generateDailySummary', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
  });

  it('generates a daily summary from entries', async () => {
    const llmOutput = `## Narrative

The developer worked on auth and tests.

## Key Decisions

- JWT over sessions for statelessness

## Open Threads

- Need to add refresh token support`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const entries = _makeEntries(2);
    const result = await generateDailySummary(entries, '2026-02-22');

    expect(result.narrative).toContain('auth and tests');
    expect(result.keyDecisions).toContain('JWT');
    expect(result.openThreads).toContain('refresh token');
    expect(result.errors).toEqual([]);
    expect(result.generatedAt).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// Logger calls at LangGraph node boundaries — verified at entry and exit
// points where meaningful state is captured (date, entry count). These log
// sites are the correlation anchors for trace context injected by the pino
// bridge when an OTel SDK is active.
// ---------------------------------------------------------------------------

describe('dailySummaryNode logger calls', () => {
  const LLM_OUTPUT = `## Narrative\nWork done.\n## Key Decisions\n- Used X\n## Open Threads\n- Need Y`;

  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info at start with meaningful content (not empty or bare function name)', async () => {
    mockInvoke.mockResolvedValue({ content: LLM_OUTPUT });
    const entries = _makeEntries(3);

    await dailySummaryNode({ entries, date: '2026-02-22' });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('dailySummaryNode');
    expect(message.length).toBeGreaterThan(5);
  });

  it('calls logger.info after successful LLM generation', async () => {
    mockInvoke.mockResolvedValue({ content: LLM_OUTPUT });
    const entries = _makeEntries(2);

    await dailySummaryNode({ entries, date: '2026-02-22' });

    // Expect a start log and at least one completion/result log
    expect(vi.mocked(logger.info).mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('calls logger.info even on early exit (no entries)', async () => {
    await dailySummaryNode({ entries: [], date: '2026-02-22' });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message.length).toBeGreaterThan(5);
  });
});

describe('generateDailySummary logger calls', () => {
  const LLM_OUTPUT = `## Narrative\nWork done.\n## Key Decisions\n- Used X\n## Open Threads\n- Need Y`;

  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info at start with entry count and date', async () => {
    mockInvoke.mockResolvedValue({ content: LLM_OUTPUT });
    const entries = _makeEntries(3);

    await generateDailySummary(entries, '2026-02-22');

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('generateDailySummary');
    expect(message.length).toBeGreaterThan(5);
  });
});
