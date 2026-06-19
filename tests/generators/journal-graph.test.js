// ABOUTME: Tests for journal-graph.js — AI generation pipeline
// ABOUTME: Contract tests mock ChatAnthropic; unit tests cover deterministic helpers

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the LLM provider before importing the module under test.
// All ChatAnthropic instances delegate invoke to this shared spy.
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
  // Deterministic helpers
  analyzeCommitContent,
  generateImplementationGuidance,
  formatSessionsForAI,
  formatChatMessages,
  formatContextForSummary,
  formatContextForUser,
  cleanDialogueOutput,
  cleanTechnicalOutput,
  cleanSummaryOutput,
  escapeForJson,
  hasFunctionalCode,
  NODE_TEMPERATURES,
  // LLM boundary (nodes)
  summaryNode,
  technicalNode,
  dialogueNode,
  // Graph
  buildGraph,
  getModel,
  resetModel,
  generateJournalSections,
} from '../../src/generators/journal-graph.js';
import logger from '../../src/logger.js';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

/**
 * Create a context object matching the shape expected by graph nodes.
 * Defaults provide functional code diff, sessions with chat, and
 * enough substantial messages to avoid early exits.
 */
function _makeContext({
  shortHash = 'abc123d',
  author = 'Test User',
  message = 'feat: add feature',
  diff = [
    'diff --git a/src/index.js b/src/index.js',
    '--- a/src/index.js',
    '+++ b/src/index.js',
    '+console.log("hello");',
  ].join('\n'),
  isMerge = false,
  sessions = null,
  substantialUserMessages = 5,
} = {}) {
  const defaultSessions = new Map();
  defaultSessions.set('session-1', [
    { type: 'user', content: 'Let me implement this feature', timestamp: '2026-02-21T10:00:00Z' },
    { type: 'assistant', content: 'Sure, I can help with that', timestamp: '2026-02-21T10:00:05Z' },
    { type: 'user', content: 'What about error handling?', timestamp: '2026-02-21T10:01:00Z' },
  ]);

  return {
    commit: {
      hash: 'abc123def456789',
      shortHash,
      message,
      subject: message,
      author,
      authorEmail: 'test@example.com',
      timestamp: new Date('2026-02-21T10:15:32Z'),
      diff,
      isMerge,
      parentCount: isMerge ? 2 : 1,
    },
    chat: {
      messages: [],
      sessions: sessions ?? defaultSessions,
      messageCount: 3,
      sessionCount: (sessions ?? defaultSessions).size,
    },
    metadata: {
      previousCommitTime: new Date('2026-02-21T09:00:00Z'),
      timeWindow: {
        start: new Date('2026-02-21T09:00:00Z'),
        end: new Date('2026-02-21T10:15:32Z'),
      },
      filterStats: {
        totalMessages: 10,
        filteredMessages: 5,
        preservedMessages: 5,
        substantialUserMessages,
        filterReasons: { toolUse: 3, tooShort: 2 },
      },
      tokenEstimate: 5000,
      tokenBudget: { total: 150000 },
      sensitiveDataFilter: { totalRedactions: 0 },
    },
  };
}

beforeEach(() => {
  resetModel();
  mockInvoke.mockReset();
});

// ===========================================================================
// Deterministic helpers
// ===========================================================================

describe('analyzeCommitContent', () => {
  it('returns empty result for null diff', () => {
    const result = analyzeCommitContent(null);
    expect(result).toEqual({
      changedFiles: [],
      docFiles: [],
      functionalFiles: [],
      hasFunctionalCode: false,
      hasOnlyDocs: false,
    });
  });

  it('returns empty result for empty string diff', () => {
    const result = analyzeCommitContent('');
    expect(result).toEqual({
      changedFiles: [],
      docFiles: [],
      functionalFiles: [],
      hasFunctionalCode: false,
      hasOnlyDocs: false,
    });
  });

  it('identifies documentation files', () => {
    const diff = [
      'diff --git a/README.md b/README.md',
      '--- a/README.md',
      '+++ b/README.md',
      '+new content',
      'diff --git a/config.yml b/config.yml',
      '--- a/config.yml',
      '+++ b/config.yml',
      '+setting: true',
    ].join('\n');
    const result = analyzeCommitContent(diff);
    expect(result.docFiles).toEqual(['README.md', 'config.yml']);
    expect(result.functionalFiles).toEqual([]);
    expect(result.hasOnlyDocs).toBe(true);
    expect(result.hasFunctionalCode).toBe(false);
  });

  it('identifies functional code files', () => {
    const diff = [
      'diff --git a/src/index.js b/src/index.js',
      '--- a/src/index.js',
      '+++ b/src/index.js',
      '+console.log("hello");',
    ].join('\n');
    const result = analyzeCommitContent(diff);
    expect(result.functionalFiles).toEqual(['src/index.js']);
    expect(result.docFiles).toEqual([]);
    expect(result.hasFunctionalCode).toBe(true);
    expect(result.hasOnlyDocs).toBe(false);
  });

  it('handles mixed file types', () => {
    const diff = [
      'diff --git a/src/app.js b/src/app.js',
      '--- a/src/app.js',
      '+++ b/src/app.js',
      '+code()',
      'diff --git a/docs/guide.md b/docs/guide.md',
      '--- a/docs/guide.md',
      '+++ b/docs/guide.md',
      '+text',
    ].join('\n');
    const result = analyzeCommitContent(diff);
    expect(result.functionalFiles).toEqual(['src/app.js']);
    expect(result.docFiles).toEqual(['docs/guide.md']);
    expect(result.hasFunctionalCode).toBe(true);
    expect(result.hasOnlyDocs).toBe(false);
  });

  it('excludes journal entry files', () => {
    const diff = [
      'diff --git a/journal/entries/2026-02-21.md b/journal/entries/2026-02-21.md',
      '--- a/journal/entries/2026-02-21.md',
      '+++ b/journal/entries/2026-02-21.md',
      '+entry content',
      'diff --git a/src/index.js b/src/index.js',
      '--- a/src/index.js',
      '+++ b/src/index.js',
      '+code()',
    ].join('\n');
    const result = analyzeCommitContent(diff);
    expect(result.changedFiles).toEqual(['src/index.js']);
    expect(result.changedFiles).not.toContain('journal/entries/2026-02-21.md');
  });

  it('deduplicates file paths from --- and +++ headers', () => {
    const diff = [
      'diff --git a/src/index.js b/src/index.js',
      '--- a/src/index.js',
      '+++ b/src/index.js',
      '+code()',
    ].join('\n');
    const result = analyzeCommitContent(diff);
    // Both --- and +++ reference src/index.js, should appear once
    expect(result.changedFiles).toEqual(['src/index.js']);
  });

  it('recognizes all documentation file patterns', () => {
    const docExtensions = [
      'file.md', 'file.txt', 'README', 'CHANGELOG',
      'LICENSE', 'config.yaml', 'config.yml', 'data.json',
      'config.toml', 'settings.ini', '.env', '.gitignore',
    ];
    for (const filename of docExtensions) {
      const diff = `--- a/${filename}\n+++ b/${filename}\n+content`;
      const result = analyzeCommitContent(diff);
      expect(result.docFiles).toContain(filename);
    }
  });
});

describe('generateImplementationGuidance', () => {
  it('returns empty string when no files changed', () => {
    const analysis = { functionalFiles: [], docFiles: [], hasOnlyDocs: false };
    expect(generateImplementationGuidance(analysis)).toBe('');
  });

  it('returns doc-only guidance when hasOnlyDocs is true', () => {
    const analysis = {
      functionalFiles: [],
      docFiles: ['README.md', 'docs/guide.md'],
      hasOnlyDocs: true,
    };
    const result = generateImplementationGuidance(analysis);
    expect(result).toContain('ONLY documentation');
    expect(result).toContain('README.md');
    expect(result).toContain('Discussed');
  });

  it('returns functional file guidance with IMPLEMENTED/DISCUSSED', () => {
    const analysis = {
      functionalFiles: ['src/index.js', 'src/utils.js'],
      docFiles: [],
      hasOnlyDocs: false,
    };
    const result = generateImplementationGuidance(analysis);
    expect(result).toContain('IMPLEMENTED vs DISCUSSED');
    expect(result).toContain('src/index.js');
    expect(result).toContain('src/utils.js');
  });

  it('includes both functional and doc files when mixed', () => {
    const analysis = {
      functionalFiles: ['src/app.js'],
      docFiles: ['README.md'],
      hasOnlyDocs: false,
    };
    const result = generateImplementationGuidance(analysis);
    expect(result).toContain('src/app.js');
    expect(result).toContain('README.md');
  });
});

describe('hasFunctionalCode', () => {
  it('returns true for diffs with functional files', () => {
    const diff = '--- a/src/index.js\n+++ b/src/index.js\n+code()';
    expect(hasFunctionalCode(diff)).toBe(true);
  });

  it('returns false for doc-only diffs', () => {
    const diff = '--- a/README.md\n+++ b/README.md\n+text';
    expect(hasFunctionalCode(diff)).toBe(false);
  });

  it('returns false for null diff', () => {
    expect(hasFunctionalCode(null)).toBe(false);
  });
});

describe('formatSessionsForAI', () => {
  it('returns empty array for null sessions', () => {
    expect(formatSessionsForAI(null)).toEqual([]);
  });

  it('returns empty array for empty Map', () => {
    expect(formatSessionsForAI(new Map())).toEqual([]);
  });

  it('formats a single session with indexed ID', () => {
    const sessions = new Map();
    sessions.set('sess-abc', [
      { type: 'user', content: 'hello', timestamp: '2026-02-21T10:00:00Z' },
    ]);
    const result = formatSessionsForAI(sessions);
    expect(result).toHaveLength(1);
    expect(result[0].session_id).toBe('Session 1');
    expect(result[0].message_count).toBe(1);
    expect(result[0].messages[0]).toEqual({
      type: 'user',
      content: 'hello',
      timestamp: '2026-02-21T10:00:00Z',
    });
  });

  it('formats multiple sessions with sequential IDs', () => {
    const sessions = new Map();
    sessions.set('sess-1', [
      { type: 'user', content: 'first', timestamp: '2026-02-21T10:00:00Z' },
    ]);
    sessions.set('sess-2', [
      { type: 'user', content: 'second', timestamp: '2026-02-21T11:00:00Z' },
      { type: 'assistant', content: 'reply', timestamp: '2026-02-21T11:00:05Z' },
    ]);
    const result = formatSessionsForAI(sessions);
    expect(result).toHaveLength(2);
    expect(result[0].session_id).toBe('Session 1');
    expect(result[1].session_id).toBe('Session 2');
    expect(result[1].message_count).toBe(2);
  });

  it('uses null for session_start when first message has no timestamp', () => {
    const sessions = new Map();
    sessions.set('sess-1', [{ type: 'user', content: 'msg' }]);
    const result = formatSessionsForAI(sessions);
    expect(result[0].session_start).toBeNull();
  });
});

describe('formatChatMessages', () => {
  it('returns default message for null messages', () => {
    expect(formatChatMessages(null)).toBe('*No conversation captured for this time window*');
  });

  it('returns default message for empty array', () => {
    expect(formatChatMessages([])).toBe('*No conversation captured for this time window*');
  });

  it('formats messages as JSON lines with types and timestamps', () => {
    const messages = [
      { type: 'user', content: 'hello world', timestamp: '2026-02-21T10:00:00Z' },
    ];
    const result = formatChatMessages(messages);
    expect(result).toContain('"type":"user"');
    expect(result).toContain('"content":"hello world"');
    expect(result).toContain('"time":');
  });

  it('maps non-user types to assistant', () => {
    const messages = [
      { type: 'system', content: 'system msg', timestamp: '2026-02-21T10:00:00Z' },
    ];
    const result = formatChatMessages(messages);
    expect(result).toContain('"type":"assistant"');
  });

  it('handles missing or invalid timestamps', () => {
    const messages = [
      { type: 'user', content: 'no timestamp' },
      { type: 'user', content: 'bad timestamp', timestamp: 'not-a-date' },
    ];
    const result = formatChatMessages(messages);
    // Both lines should have empty time strings
    const lines = result.split('\n\n');
    expect(lines).toHaveLength(2);
    for (const line of lines) {
      expect(line).toContain('"time":""');
    }
  });
});

describe('escapeForJson', () => {
  it('returns empty string for null', () => {
    expect(escapeForJson(null)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(escapeForJson('')).toBe('');
  });

  it('escapes backslashes', () => {
    expect(escapeForJson('path\\to\\file')).toBe('path\\\\to\\\\file');
  });

  it('escapes double quotes', () => {
    expect(escapeForJson('say "hello"')).toBe('say \\"hello\\"');
  });

  it('escapes newlines, carriage returns, and tabs', () => {
    expect(escapeForJson('line1\nline2')).toBe('line1\\nline2');
    expect(escapeForJson('col1\tcol2')).toBe('col1\\tcol2');
    expect(escapeForJson('win\r\nline')).toBe('win\\r\\nline');
  });
});

describe('formatContextForSummary', () => {
  it('includes commit data in output', () => {
    const context = _makeContext();
    const result = formatContextForSummary(context);
    expect(result).toContain('abc123d');
    expect(result).toContain('Test User');
    expect(result).toContain('feat: add feature');
  });

  it('filters out assistant messages, keeps only user messages', () => {
    const sessions = new Map();
    sessions.set('sess-1', [
      { type: 'user', content: 'user message' },
      { type: 'assistant', content: 'assistant reply' },
      { type: 'user', content: 'another user message' },
    ]);
    const context = _makeContext({ sessions });
    const result = formatContextForSummary(context);
    expect(result).toContain('user message');
    expect(result).toContain('another user message');
    expect(result).not.toContain('assistant reply');
  });

  it('handles empty sessions', () => {
    const context = _makeContext({ sessions: new Map() });
    const result = formatContextForSummary(context);
    expect(result).toContain('DEVELOPER MESSAGES');
    // Should have empty sessions array
    expect(result).toContain('[]');
  });

  it('skips sessions with no user messages', () => {
    const sessions = new Map();
    sessions.set('sess-1', [
      { type: 'assistant', content: 'only assistant here' },
    ]);
    sessions.set('sess-2', [
      { type: 'user', content: 'user in session 2' },
    ]);
    const context = _makeContext({ sessions });
    const result = formatContextForSummary(context);
    // Only session 2 should appear, numbered as Session 1
    expect(result).toContain('Session 1');
    expect(result).not.toContain('Session 2');
    expect(result).toContain('user in session 2');
  });
});

describe('formatContextForUser', () => {
  it('includes commit info and code changes', () => {
    const context = _makeContext();
    const result = formatContextForUser(context);
    expect(result).toContain('## Commit Information');
    expect(result).toContain('abc123d');
    expect(result).toContain('## Code Changes');
    expect(result).toContain('```diff');
  });

  it('includes formatted sessions', () => {
    const context = _makeContext();
    const result = formatContextForUser(context);
    expect(result).toContain('## Development Conversation');
    expect(result).toContain('Session 1');
  });

  it('includes summary section when requested', () => {
    const context = _makeContext();
    const result = formatContextForUser(context, {
      includeSummary: true,
      summary: 'The developer added a new feature.',
    });
    expect(result).toContain('## Session Summary');
    expect(result).toContain('The developer added a new feature.');
  });

  it('excludes summary section by default', () => {
    const context = _makeContext();
    const result = formatContextForUser(context);
    expect(result).not.toContain('## Session Summary');
  });
});

// ---------------------------------------------------------------------------
// Post-processing / cleaning functions
// ---------------------------------------------------------------------------

describe('cleanDialogueOutput', () => {
  it('passes through null', () => {
    expect(cleanDialogueOutput(null)).toBeNull();
  });

  it('passes through "No significant dialogue" message', () => {
    const msg = 'No significant dialogue found for this session';
    expect(cleanDialogueOutput(msg)).toBe(msg);
  });

  it('extracts blockquote lines', () => {
    const raw = '> **Human:** "Let me try this"\n\n> **Human:** "That worked"';
    const result = cleanDialogueOutput(raw);
    expect(result).toContain('> **Human:** "Let me try this"');
    expect(result).toContain('> **Human:** "That worked"');
  });

  it('strips preamble and postamble text', () => {
    const raw = [
      'Here are the key quotes from the session:',
      '',
      '> **Human:** "The real quote"',
      '',
      'These quotes demonstrate the developer\'s approach.',
    ].join('\n');
    const result = cleanDialogueOutput(raw);
    expect(result).toBe('> **Human:** "The real quote"');
  });

  it('preserves blank lines between quote blocks', () => {
    const raw = '> **Human:** "First quote"\n\n> **Human:** "Second quote"';
    const result = cleanDialogueOutput(raw);
    expect(result).toBe('> **Human:** "First quote"\n\n> **Human:** "Second quote"');
  });

  it('returns fallback when no blockquotes found', () => {
    const raw = 'Just some commentary with no actual quotes.';
    expect(cleanDialogueOutput(raw)).toBe(
      'No significant dialogue found for this development session'
    );
  });

  it('passes through empty string (falsy early return)', () => {
    expect(cleanDialogueOutput('')).toBe('');
  });

  it('replaces literal backslash-n with real newlines', () => {
    const raw = '> **Human:** "Line one\\nLine two"';
    const result = cleanDialogueOutput(raw);
    expect(result).toContain('Line one\nLine two');
    expect(result).not.toContain('\\n');
  });
});

describe('cleanTechnicalOutput', () => {
  it('passes through null', () => {
    expect(cleanTechnicalOutput(null)).toBeNull();
  });

  it('passes through "No significant technical decisions" message', () => {
    const msg = 'No significant technical decisions documented for this session';
    expect(cleanTechnicalOutput(msg)).toBe(msg);
  });

  it('extracts DECISION lines', () => {
    const raw = '**DECISION: Use ESM modules** (Implemented) - FILES: src/index.js';
    expect(cleanTechnicalOutput(raw)).toBe(raw);
  });

  it('extracts bullet-prefixed DECISION lines', () => {
    const raw = '- **DECISION: Use ESM** (Implemented)';
    expect(cleanTechnicalOutput(raw)).toBe(raw);
  });

  it('preserves sub-items under a DECISION', () => {
    const raw = [
      '**DECISION: Use ESM** (Implemented)',
      '  - Better module support',
      '  - Tree shaking enabled',
      '  Tradeoffs: Requires Node 14+',
    ].join('\n');
    expect(cleanTechnicalOutput(raw)).toBe(raw);
  });

  it('strips preamble text before DECISION lines', () => {
    const raw = [
      'Here are the technical decisions:',
      '',
      '**DECISION: Use Vitest** (Implemented)',
      '  - Fast execution',
    ].join('\n');
    const result = cleanTechnicalOutput(raw);
    expect(result).toBe('**DECISION: Use Vitest** (Implemented)\n  - Fast execution');
  });

  it('returns fallback when no DECISION lines found', () => {
    const raw = 'The developer made several improvements to the codebase.';
    expect(cleanTechnicalOutput(raw)).toBe(
      'No significant technical decisions documented for this development session'
    );
  });

  it('returns fallback for empty content after cleaning', () => {
    const raw = 'Just a narrative paragraph with no structured decisions.';
    expect(cleanTechnicalOutput(raw)).toBe(
      'No significant technical decisions documented for this development session'
    );
  });
});

describe('cleanSummaryOutput', () => {
  it('passes through null', () => {
    expect(cleanSummaryOutput(null)).toBeNull();
  });

  it.each([
    ['comprehensive', 'detailed'],
    ['comprehensively', 'thoroughly'],
    ['robust', 'solid'],
    ['significant', 'important'],
    ['systematic', 'structured'],
    ['systematically', 'carefully'],
    ['meticulous', 'careful'],
    ['meticulously', 'carefully'],
    ['methodical', 'careful'],
    ['methodically', 'carefully'],
    ['sophisticated', 'advanced'],
    ['leveraging', 'using'],
    ['leveraged', 'used'],
    ['enhanced', 'improved'],
    ['enhancing', 'improving'],
    ['enhancement', 'improvement'],
    ['enhancements', 'improvements'],
    ['utilizing', 'using'],
    ['utilization', 'use'],
    ['utilized', 'used'],
  ])('replaces banned word "%s" with "%s"', (banned, expected) => {
    const result = cleanSummaryOutput(`The ${banned} approach worked well.`);
    expect(result).toContain(expected);
    expect(result.toLowerCase()).not.toContain(banned);
  });

  it('replaces "a sophisticated" with "an advanced"', () => {
    const result = cleanSummaryOutput('Built a sophisticated system.');
    expect(result).toContain('an advanced');
  });

  it('handles case-insensitive replacement', () => {
    const result = cleanSummaryOutput('COMPREHENSIVE review completed.');
    expect(result).toContain('detailed');
  });

  it('strips preamble starting with "Based on"', () => {
    const raw = 'Based on the commit data, the developer wrote tests.\n\nThe actual content.';
    const result = cleanSummaryOutput(raw);
    expect(result).toBe('The actual content.');
  });

  it('strips preamble starting with "Here\'s"', () => {
    const raw = "Here's a summary of the changes:\n\nThe developer added logging.";
    const result = cleanSummaryOutput(raw);
    expect(result).toBe('The developer added logging.');
  });

  it('strips preamble starting with "Looking at"', () => {
    const raw = 'Looking at the diff, we can see changes.\n\nThe developer refactored.';
    const result = cleanSummaryOutput(raw);
    expect(result).toBe('The developer refactored.');
  });

  it('handles combined preamble and banned words', () => {
    const raw = 'Based on the changes:\n\nThe developer wrote comprehensive tests with robust coverage.';
    const result = cleanSummaryOutput(raw);
    expect(result).toContain('detailed');
    expect(result).toContain('solid');
    expect(result).not.toContain('Based on');
    expect(result).not.toContain('comprehensive');
    expect(result).not.toContain('robust');
  });
});

// ===========================================================================
// LLM boundary — contract tests
// ===========================================================================

describe('summaryNode', () => {
  it('calls LLM with system message containing guidelines and prompt', async () => {
    mockInvoke.mockResolvedValueOnce({ content: 'The developer added a feature.' });
    const context = _makeContext();
    await summaryNode({ context });

    expect(mockInvoke).toHaveBeenCalledOnce();
    const [messages] = mockInvoke.mock.calls[0];
    expect(messages).toHaveLength(2);
    // System message should contain guidelines and prompt structure
    const systemContent = messages[0].content;
    expect(systemContent).toContain('CRITICAL CONTEXT FRAMING');
    expect(systemContent).toContain('Step 1');
    expect(systemContent).toContain('Step 4');
  });

  it('sends formatted context as human message', async () => {
    mockInvoke.mockResolvedValueOnce({ content: 'Summary text.' });
    const context = _makeContext();
    await summaryNode({ context });

    const [messages] = mockInvoke.mock.calls[0];
    const userContent = messages[1].content;
    expect(userContent).toContain('abc123d');
    expect(userContent).toContain('Test User');
    expect(userContent).toContain('DEVELOPER MESSAGES');
  });

  it('applies cleanSummaryOutput to LLM response', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: 'Based on the changes:\n\nThe comprehensive test suite was robust.',
    });
    const context = _makeContext();
    const result = await summaryNode({ context });

    expect(result.summary).not.toContain('Based on');
    expect(result.summary).not.toContain('comprehensive');
    expect(result.summary).not.toContain('robust');
    expect(result.summary).toContain('detailed');
    expect(result.summary).toContain('solid');
  });

  it('returns fallback message and error on LLM failure', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('API rate limit exceeded'));
    const context = _makeContext();
    const result = await summaryNode({ context });

    expect(result.summary).toBe('[Summary generation failed]');
    expect(result.errors).toContain('Summary generation failed: API rate limit exceeded');
  });
});

describe('technicalNode', () => {
  it('returns early when no substantial user messages', async () => {
    const context = _makeContext({ substantialUserMessages: 0 });
    const result = await technicalNode({ context });

    expect(mockInvoke).not.toHaveBeenCalled();
    expect(result.technicalDecisions).toBe(
      'No significant technical decisions documented for this development session'
    );
  });

  it('calls LLM with guidelines, prompt, and implementation guidance', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: '**DECISION: Use ESM** (Implemented)\n  - Better module support',
    });
    const context = _makeContext();
    await technicalNode({ context });

    expect(mockInvoke).toHaveBeenCalledOnce();
    const [messages] = mockInvoke.mock.calls[0];
    const systemContent = messages[0].content;
    expect(systemContent).toContain('CRITICAL CONTEXT FRAMING');
    expect(systemContent).toContain('Code Archivist');
    expect(systemContent).toContain('IMPLEMENTED vs DISCUSSED');
  });

  it('applies cleanTechnicalOutput to LLM response', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: 'Analysis:\n\n**DECISION: Use Vitest** (Implemented)\n  - Fast\n\nOverall good.',
    });
    const context = _makeContext();
    const result = await technicalNode({ context });

    expect(result.technicalDecisions).toBe('**DECISION: Use Vitest** (Implemented)\n  - Fast');
  });

  it('returns fallback message and error on LLM failure', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('Timeout'));
    const context = _makeContext();
    const result = await technicalNode({ context });

    expect(result.technicalDecisions).toBe('[Technical decisions extraction failed]');
    expect(result.errors).toContain('Technical decisions extraction failed: Timeout');
  });
});

describe('dialogueNode', () => {
  it('returns early when no substantial user messages', async () => {
    const context = _makeContext({ substantialUserMessages: 0 });
    const result = await dialogueNode({ context, summary: 'Some summary' });

    expect(mockInvoke).not.toHaveBeenCalled();
    expect(result.dialogue).toBe(
      'No significant dialogue found for this development session'
    );
  });

  it('includes summary in system message', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: '> **Human:** "Let me try this"',
    });
    const context = _makeContext();
    await dialogueNode({ context, summary: 'The developer added logging.' });

    const [messages] = mockInvoke.mock.calls[0];
    const systemContent = messages[0].content;
    expect(systemContent).toContain('The developer added logging.');
    expect(systemContent).toContain('summary of this development session');
  });

  it('replaces {maxQuotes} placeholder with calculated value', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: '> **Human:** "Test quote"',
    });
    // 100 substantial messages → maxQuotes = min(ceil(100*0.08)+1, 15) = min(9, 15) = 9
    const context = _makeContext({ substantialUserMessages: 100 });
    await dialogueNode({ context, summary: 'Summary' });

    const [messages] = mockInvoke.mock.calls[0];
    const systemContent = messages[0].content;
    expect(systemContent).toContain('up to 9 quotes');
    expect(systemContent).not.toContain('{maxQuotes}');
  });

  it('caps maxQuotes at 15', async () => {
    mockInvoke.mockResolvedValueOnce({ content: '> **Human:** "quote"' });
    // 300 substantial messages → maxQuotes = min(ceil(300*0.08)+1, 15) = min(25, 15) = 15
    const context = _makeContext({ substantialUserMessages: 300 });
    await dialogueNode({ context, summary: 'Summary' });

    const [messages] = mockInvoke.mock.calls[0];
    const systemContent = messages[0].content;
    // Verify maxQuotes is capped — prompt should have "15" where {maxQuotes} was
    expect(systemContent).toContain('up to 15 quotes');
    expect(systemContent).not.toContain('{maxQuotes}');
  });

  it('applies cleanDialogueOutput to LLM response', async () => {
    mockInvoke.mockResolvedValueOnce({
      content: 'Key quotes:\n\n> **Human:** "The actual quote"\n\nGreat insights.',
    });
    const context = _makeContext();
    const result = await dialogueNode({ context, summary: 'Summary' });

    expect(result.dialogue).toBe('> **Human:** "The actual quote"');
  });

  it('returns fallback message and error on LLM failure', async () => {
    mockInvoke.mockRejectedValueOnce(new Error('Connection reset'));
    const context = _makeContext();
    const result = await dialogueNode({ context, summary: 'Summary' });

    expect(result.dialogue).toBe('[Dialogue extraction failed]');
    expect(result.errors).toContain('Dialogue extraction failed: Connection reset');
  });
});

// ===========================================================================
// Model caching and graph structure
// ===========================================================================

describe('getModel / resetModel', () => {
  it('returns a model instance with invoke method', () => {
    const model = getModel(0.7);
    expect(model).toBeDefined();
    expect(typeof model.invoke).toBe('function');
  });

  it('returns the same instance for the same temperature', () => {
    const model1 = getModel(0.7);
    const model2 = getModel(0.7);
    expect(model1).toBe(model2);
  });

  it('returns different instances for different temperatures', () => {
    const model1 = getModel(0.1);
    const model2 = getModel(0.7);
    expect(model1).not.toBe(model2);
  });

  it('clears cache on resetModel', () => {
    const model1 = getModel(0.7);
    resetModel();
    const model2 = getModel(0.7);
    expect(model1).not.toBe(model2);
  });
});

describe('NODE_TEMPERATURES', () => {
  it('has expected temperature values', () => {
    expect(NODE_TEMPERATURES.summary).toBe(0.7);
    expect(NODE_TEMPERATURES.dialogue).toBe(0.7);
    expect(NODE_TEMPERATURES.technical).toBe(0.1);
  });
});

describe('buildGraph', () => {
  it('compiles without error', () => {
    const graph = buildGraph();
    expect(graph).toBeDefined();
  });

  it('returns a graph with an invoke method', () => {
    const graph = buildGraph();
    expect(typeof graph.invoke).toBe('function');
  });
});

describe('generateJournalSections', () => {
  it('returns correct output shape with all sections', async () => {
    // Mock invoke to return appropriate responses based on system message content
    mockInvoke.mockImplementation(async (messages) => {
      const systemContent = messages[0].content;
      if (systemContent.includes('Write one opening sentence')) {
        return { content: 'The developer added a feature.' };
      }
      if (systemContent.includes('Code Archivist')) {
        return { content: '**DECISION: Use ESM** (Implemented)\n  - Better support' };
      }
      if (systemContent.includes('journalist')) {
        return { content: '> **Human:** "Let me implement this"' };
      }
      return { content: 'Default response' };
    });

    const context = _makeContext();
    const result = await generateJournalSections(context);

    expect(result).toHaveProperty('summary');
    expect(result).toHaveProperty('dialogue');
    expect(result).toHaveProperty('technicalDecisions');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('generatedAt');
    expect(result.generatedAt).toBeInstanceOf(Date);
    expect(Array.isArray(result.errors)).toBe(true);
  });

  it('returns empty errors array on success', async () => {
    mockInvoke.mockResolvedValue({ content: 'Response text.' });
    const context = _makeContext();
    const result = await generateJournalSections(context);

    expect(result.errors).toEqual([]);
  });

  it('accumulates errors from failing nodes', async () => {
    mockInvoke.mockRejectedValue(new Error('API down'));
    const context = _makeContext();
    const result = await generateJournalSections(context);

    // All three nodes should report errors
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
    expect(result.errors.some((e) => e.includes('failed'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Logger call assertions (issue #83)
// Priority: these functions are future span sites; logger.info calls inside
// them get trace_id/span_id injected once spiny-orb wraps them in spans.
// ---------------------------------------------------------------------------

describe('summaryNode logger calls', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info at start with meaningful content (not empty or bare function name)', async () => {
    mockInvoke.mockResolvedValue({ content: 'Generated summary text.' });
    const context = _makeContext();

    await summaryNode({ context });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('summaryNode');
    expect(message.length).toBeGreaterThan(5);
  });
});

describe('technicalNode logger calls', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info when making LLM call (substantial messages present)', async () => {
    mockInvoke.mockResolvedValue({ content: '- **DECISION: Use X** (Implemented)' });
    const context = _makeContext({ substantialUserMessages: 5 });

    await technicalNode({ context });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('technicalNode');
    expect(message.length).toBeGreaterThan(5);
  });

  it('calls logger.info on early exit path (no substantial messages)', async () => {
    const context = _makeContext({ substantialUserMessages: 0 });

    await technicalNode({ context });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    expect(mockInvoke).not.toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message.length).toBeGreaterThan(5);
  });
});

describe('dialogueNode logger calls', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info when making LLM call (substantial messages present)', async () => {
    mockInvoke.mockResolvedValue({ content: '> **Human:** "How?"' });
    const context = _makeContext({ substantialUserMessages: 5 });

    await dialogueNode({ context, summary: 'Test summary' });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('dialogueNode');
    expect(message.length).toBeGreaterThan(5);
  });

  it('calls logger.info on early exit path (no substantial messages)', async () => {
    const context = _makeContext({ substantialUserMessages: 0 });

    await dialogueNode({ context, summary: 'Test summary' });

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    expect(mockInvoke).not.toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message.length).toBeGreaterThan(5);
  });
});

describe('generateJournalSections logger calls', () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    resetModel();
    vi.mocked(logger.info).mockReset();
  });

  it('calls logger.info at start with context info', async () => {
    mockInvoke.mockResolvedValue({ content: 'Generated content.' });
    const context = _makeContext();

    await generateJournalSections(context);

    expect(vi.mocked(logger.info)).toHaveBeenCalled();
    const firstCall = vi.mocked(logger.info).mock.calls[0];
    const message = firstCall.find(arg => typeof arg === 'string');
    expect(message).toBeTruthy();
    expect(message).not.toBe('generateJournalSections');
    expect(message.length).toBeGreaterThan(5);
  });
});
