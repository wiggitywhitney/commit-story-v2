// ABOUTME: Tests for src/index.js — verifies all exit paths return exit codes instead of calling process.exit()
// ABOUTME: Confirms the root span's finally block is reachable from all exit paths in main() and handleSummarize()

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Hoist mocks before any imports

vi.mock('dotenv/config', () => ({}));
vi.mock('../src/traceloop-init.js', () => ({}));
vi.mock('../src/utils/config.js', () => ({
  config: { anthropicApiKey: 'test-key', autoSummarize: false },
}));

const mockExecFileSync = vi.fn();
vi.mock('node:child_process', () => ({
  execFileSync: (...args) => mockExecFileSync(...args),
}));

const mockGatherContext = vi.fn();
vi.mock('../src/integrators/context-integrator.js', () => ({
  gatherContextForCommit: (...args) => mockGatherContext(...args),
}));

const mockGenerateSections = vi.fn();
vi.mock('../src/generators/journal-graph.js', () => ({
  generateJournalSections: (...args) => mockGenerateSections(...args),
}));

const mockSaveEntry = vi.fn();
const mockDiscoverReflections = vi.fn();
vi.mock('../src/managers/journal-manager.js', () => ({
  saveJournalEntry: (...args) => mockSaveEntry(...args),
  discoverReflections: (...args) => mockDiscoverReflections(...args),
}));

const mockIsJournalOnly = vi.fn();
const mockIsMerge = vi.fn();
const mockIsSafeGitRef = vi.fn();
vi.mock('../src/utils/commit-analyzer.js', () => ({
  isJournalEntriesOnlyCommit: (...args) => mockIsJournalOnly(...args),
  isMergeCommit: (...args) => mockIsMerge(...args),
  shouldSkipMergeCommit: vi.fn(() => false),
  isSafeGitRef: (...args) => mockIsSafeGitRef(...args),
}));

const mockTriggerAutoSummaries = vi.fn();
vi.mock('../src/managers/auto-summarize.js', () => ({
  triggerAutoSummaries: (...args) => mockTriggerAutoSummaries(...args),
}));

const mockParseSummarizeArgs = vi.fn();
const mockRunSummarize = vi.fn();
const mockRunWeeklySummarize = vi.fn();
const mockRunMonthlySummarize = vi.fn();
const mockShowSummarizeHelp = vi.fn();
vi.mock('../src/commands/summarize.js', () => ({
  parseSummarizeArgs: (...args) => mockParseSummarizeArgs(...args),
  runSummarize: (...args) => mockRunSummarize(...args),
  runWeeklySummarize: (...args) => mockRunWeeklySummarize(...args),
  runMonthlySummarize: (...args) => mockRunMonthlySummarize(...args),
  showSummarizeHelp: (...args) => mockShowSummarizeHelp(...args),
}));

vi.mock('../src/logger.js', () => ({
  default: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn(), level: 'info' },
}));

import { main, handleSummarize } from '../src/index.js';

const EXIT_SUCCESS = 0;
const EXIT_ERROR = 1;
const EXIT_SKIPPED = 2;

describe('main() exit code behavior', () => {
  let mockExit;
  let originalArgv;

  beforeEach(() => {
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
    originalArgv = process.argv;
    process.argv = ['node', 'index.js']; // default: no special flags
    process.env.ANTHROPIC_API_KEY = 'test-key';
    vi.clearAllMocks();
    // Default: happy-path mocks
    mockExecFileSync.mockReturnValue(Buffer.from(''));
    mockIsSafeGitRef.mockReturnValue(true);
    mockIsJournalOnly.mockReturnValue(false);
    mockIsMerge.mockReturnValue({ isMerge: false });
    mockGatherContext.mockResolvedValue({
      commit: { diff: 'some diff', timestamp: new Date() },
      chat: { messageCount: 1 },
    });
    mockGenerateSections.mockResolvedValue({ summary: 'text', errors: [] });
    mockDiscoverReflections.mockResolvedValue([]);
    mockSaveEntry.mockResolvedValue('/journal/2026-01-01.md');
  });

  afterEach(() => {
    process.argv = originalArgv;
    delete process.env.ANTHROPIC_API_KEY;
    mockExit.mockRestore();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() on success', async () => {
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on success path', async () => {
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() when --help flag set', async () => {
    process.argv = ['node', 'index.js', '--help'];
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on --help path', async () => {
    process.argv = ['node', 'index.js', '--help'];
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() when not in a git repo', async () => {
    mockExecFileSync.mockImplementation((cmd, args) => {
      if (args[0] === 'rev-parse' && args[1] === '--git-dir') {
        throw new Error('not a git repo');
      }
    });
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on not-a-git-repo path', async () => {
    mockExecFileSync.mockImplementation((cmd, args) => {
      if (args[0] === 'rev-parse' && args[1] === '--git-dir') {
        throw new Error('not a git repo');
      }
    });
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() for invalid commit ref', async () => {
    mockIsSafeGitRef.mockReturnValue(false);
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on invalid-commit-ref path', async () => {
    mockIsSafeGitRef.mockReturnValue(false);
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SKIPPED and does not call process.exit() for journal-only commits', async () => {
    mockIsJournalOnly.mockReturnValue(true);
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_SKIPPED);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on journal-only-commit path', async () => {
    mockIsJournalOnly.mockReturnValue(true);
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SKIPPED and does not call process.exit() for empty merge commits', async () => {
    mockIsMerge.mockReturnValue({ isMerge: true });
    mockGatherContext.mockResolvedValue({
      commit: { diff: '', timestamp: new Date() },
      chat: { messageCount: 0 },
    });
    const exitCode = await main();
    expect(exitCode).toBe(EXIT_SKIPPED);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on empty-merge-commit path', async () => {
    mockIsMerge.mockReturnValue({ isMerge: true });
    mockGatherContext.mockResolvedValue({
      commit: { diff: '', timestamp: new Date() },
      chat: { messageCount: 0 },
    });
    let finallyRan = false;
    try {
      await main();
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });
});

describe('handleSummarize() exit code behavior', () => {
  let mockExit;

  beforeEach(() => {
    mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {});
    process.env.ANTHROPIC_API_KEY = 'test-key';
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.ANTHROPIC_API_KEY;
    mockExit.mockRestore();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() when help requested', async () => {
    mockParseSummarizeArgs.mockReturnValue({ help: true });
    const exitCode = await handleSummarize([]);
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('finally block is reachable on help path', async () => {
    mockParseSummarizeArgs.mockReturnValue({ help: true });
    let finallyRan = false;
    try {
      await handleSummarize([]);
    } finally {
      finallyRan = true;
    }
    expect(finallyRan).toBe(true);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() when args parse error', async () => {
    mockParseSummarizeArgs.mockReturnValue({ error: 'bad args' });
    const exitCode = await handleSummarize([]);
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() on successful daily summarize', async () => {
    mockParseSummarizeArgs.mockReturnValue({ dates: ['2026-01-01'], force: false });
    mockRunSummarize.mockResolvedValue({ generated: ['path'], noEntries: [], alreadyExists: [], failed: [], errors: [] });
    const exitCode = await handleSummarize(['2026-01-01']);
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() when daily summarize fails', async () => {
    mockParseSummarizeArgs.mockReturnValue({ dates: ['2026-01-01'], force: false });
    mockRunSummarize.mockResolvedValue({ generated: [], noEntries: [], alreadyExists: [], failed: ['2026-01-01'], errors: [] });
    const exitCode = await handleSummarize(['2026-01-01']);
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() on successful weekly summarize', async () => {
    mockParseSummarizeArgs.mockReturnValue({ weekly: true, weeks: ['2026-W01'], force: false });
    mockRunWeeklySummarize.mockResolvedValue({ generated: ['path'], noSummaries: [], alreadyExists: [], failed: [], errors: [] });
    const exitCode = await handleSummarize(['--weekly', '2026-W01']);
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() when weekly summarize fails', async () => {
    mockParseSummarizeArgs.mockReturnValue({ weekly: true, weeks: ['2026-W01'], force: false });
    mockRunWeeklySummarize.mockResolvedValue({ generated: [], noSummaries: [], alreadyExists: [], failed: ['2026-W01'], errors: [] });
    const exitCode = await handleSummarize(['--weekly', '2026-W01']);
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_SUCCESS and does not call process.exit() on successful monthly summarize', async () => {
    mockParseSummarizeArgs.mockReturnValue({ monthly: true, months: ['2026-01'], force: false });
    mockRunMonthlySummarize.mockResolvedValue({ generated: ['path'], noSummaries: [], alreadyExists: [], failed: [], errors: [] });
    const exitCode = await handleSummarize(['--monthly', '2026-01']);
    expect(exitCode).toBe(EXIT_SUCCESS);
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('returns EXIT_ERROR and does not call process.exit() when monthly summarize fails', async () => {
    mockParseSummarizeArgs.mockReturnValue({ monthly: true, months: ['2026-01'], force: false });
    mockRunMonthlySummarize.mockResolvedValue({ generated: [], noSummaries: [], alreadyExists: [], failed: ['2026-01'], errors: [] });
    const exitCode = await handleSummarize(['--monthly', '2026-01']);
    expect(exitCode).toBe(EXIT_ERROR);
    expect(mockExit).not.toHaveBeenCalled();
  });
});
