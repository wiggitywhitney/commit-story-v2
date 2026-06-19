// ABOUTME: Tests for weekly summary functions in summary-manager.js
// ABOUTME: Covers week boundaries, reading daily summaries, formatting, saving, and full pipeline

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Mock the LLM provider
const mockInvoke = vi.fn();
vi.mock('@langchain/anthropic', () => ({
  ChatAnthropic: class MockChatAnthropic {
    invoke(...args) {
      return mockInvoke(...args);
    }
  },
}));

import {
  getWeekBoundaries,
  readWeekDailySummaries,
  formatWeeklySummary,
  saveWeeklySummary,
  generateAndSaveWeeklySummary,
} from '../../src/managers/summary-manager.js';
import { resetModel } from '../../src/generators/summary-graph.js';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

async function _setupTmpDir() {
  return await mkdtemp(join(tmpdir(), 'commit-story-weekly-test-'));
}

async function _writeDailySummary(basePath, dateStr, content) {
  const dir = join(basePath, 'journal', 'summaries', 'daily');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${dateStr}.md`), content, 'utf-8');
}

function _makeDailySummaryContent(dateStr) {
  return `# Daily Summary — ${dateStr}

## Narrative

The developer worked on features for ${dateStr}.

## Key Decisions

- Chose approach A for simplicity

## Open Threads

- Need to add tests`;
}

// ---------------------------------------------------------------------------
// getWeekBoundaries
// ---------------------------------------------------------------------------

describe('getWeekBoundaries', () => {
  it('returns Monday-Sunday for a normal week', () => {
    // 2026-W10: March 2-8, 2026
    const { monday, sunday } = getWeekBoundaries('2026-W10');
    expect(monday.getFullYear()).toBe(2026);
    expect(monday.getMonth()).toBe(2); // March
    expect(monday.getDate()).toBe(2);
    expect(sunday.getDate()).toBe(8);
  });

  it('returns correct boundaries for week 1', () => {
    // 2026-W01: Dec 29, 2025 - Jan 4, 2026
    const { monday, sunday } = getWeekBoundaries('2026-W01');
    expect(monday.getFullYear()).toBe(2025);
    expect(monday.getMonth()).toBe(11); // December
    expect(monday.getDate()).toBe(29);
    expect(sunday.getFullYear()).toBe(2026);
    expect(sunday.getMonth()).toBe(0); // January
    expect(sunday.getDate()).toBe(4);
  });

  it('handles year-boundary ISO weeks correctly', () => {
    // 2025-W01: Dec 30, 2024 - Jan 5, 2025
    const { monday, sunday } = getWeekBoundaries('2025-W01');
    expect(monday.getFullYear()).toBe(2024);
    expect(monday.getMonth()).toBe(11); // December
    expect(monday.getDate()).toBe(30);
  });

  it('throws for invalid week string', () => {
    expect(() => getWeekBoundaries('2026-03')).toThrow('Invalid ISO week string');
    expect(() => getWeekBoundaries('invalid')).toThrow('Invalid ISO week string');
  });
});

// ---------------------------------------------------------------------------
// readWeekDailySummaries
// ---------------------------------------------------------------------------

describe('readWeekDailySummaries', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
    mockInvoke.mockReset();
    resetModel();
  });

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('reads all daily summaries for a week', async () => {
    // 2026-W10: March 2-8
    await _writeDailySummary(tmpDir, '2026-03-02', _makeDailySummaryContent('2026-03-02'));
    await _writeDailySummary(tmpDir, '2026-03-03', _makeDailySummaryContent('2026-03-03'));
    await _writeDailySummary(tmpDir, '2026-03-04', _makeDailySummaryContent('2026-03-04'));

    const summaries = await readWeekDailySummaries('2026-W10', tmpDir);

    expect(summaries).toHaveLength(3);
    expect(summaries[0].date).toBe('2026-03-02');
    expect(summaries[1].date).toBe('2026-03-03');
    expect(summaries[2].date).toBe('2026-03-04');
    expect(summaries[0].content).toContain('2026-03-02');
  });

  it('returns empty array when no daily summaries exist', async () => {
    const summaries = await readWeekDailySummaries('2026-W10', tmpDir);
    expect(summaries).toEqual([]);
  });

  it('skips days without summaries', async () => {
    // Only Mon and Wed have summaries
    await _writeDailySummary(tmpDir, '2026-03-02', _makeDailySummaryContent('2026-03-02'));
    await _writeDailySummary(tmpDir, '2026-03-04', _makeDailySummaryContent('2026-03-04'));

    const summaries = await readWeekDailySummaries('2026-W10', tmpDir);

    expect(summaries).toHaveLength(2);
    expect(summaries[0].date).toBe('2026-03-02');
    expect(summaries[1].date).toBe('2026-03-04');
  });

  it('rethrows non-ENOENT errors from daily file reads', async () => {
    // Create the daily summary path as a directory — readFile on a directory throws EISDIR, not ENOENT
    const dir = join(tmpDir, 'journal', 'summaries', 'daily');
    await mkdir(dir, { recursive: true });
    // 2026-W10 Monday is 2026-03-02
    await mkdir(join(dir, '2026-03-02.md'));

    await expect(readWeekDailySummaries('2026-W10', tmpDir)).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// formatWeeklySummary
// ---------------------------------------------------------------------------

describe('formatWeeklySummary', () => {
  it('formats sections with correct headers', () => {
    const sections = {
      weekInReview: 'The developer worked on auth.',
      highlights: '- Shipped login flow',
      patterns: '- Heavy refactoring',
    };

    const result = formatWeeklySummary(sections, '2026-W09');

    expect(result).toContain('# Weekly Summary — 2026-W09');
    expect(result).toContain('## Week in Review');
    expect(result).toContain('The developer worked on auth.');
    expect(result).toContain('## Highlights');
    expect(result).toContain('Shipped login flow');
    expect(result).toContain('## Patterns');
    expect(result).toContain('Heavy refactoring');
  });

  it('uses fallback text for empty sections', () => {
    const sections = {
      weekInReview: '',
      highlights: '',
      patterns: '',
    };

    const result = formatWeeklySummary(sections, '2026-W09');

    expect(result).toContain('[No weekly narrative generated]');
    expect(result).toContain('No standout highlights this week.');
    expect(result).toContain('No notable patterns this week.');
  });
});

// ---------------------------------------------------------------------------
// saveWeeklySummary
// ---------------------------------------------------------------------------

describe('saveWeeklySummary', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
  });

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('saves weekly summary to correct path', async () => {
    const content = '# Weekly Summary — 2026-W10\n\nContent here.';
    const path = await saveWeeklySummary(content, '2026-W10', tmpDir);

    expect(path).toContain('journal/summaries/weekly/2026-W10.md');
    const saved = await readFile(path, 'utf-8');
    expect(saved).toBe(content);
  });

  it('skips when summary already exists', async () => {
    const weeklyDir = join(tmpDir, 'journal', 'summaries', 'weekly');
    await mkdir(weeklyDir, { recursive: true });
    await writeFile(join(weeklyDir, '2026-W10.md'), 'existing', 'utf-8');

    const path = await saveWeeklySummary('new content', '2026-W10', tmpDir);
    expect(path).toBeNull();

    // Verify original content preserved
    const content = await readFile(join(weeklyDir, '2026-W10.md'), 'utf-8');
    expect(content).toBe('existing');
  });

  it('overwrites when --force is used', async () => {
    const weeklyDir = join(tmpDir, 'journal', 'summaries', 'weekly');
    await mkdir(weeklyDir, { recursive: true });
    await writeFile(join(weeklyDir, '2026-W10.md'), 'existing', 'utf-8');

    const path = await saveWeeklySummary('new content', '2026-W10', tmpDir, { force: true });
    expect(path).not.toBeNull();

    const content = await readFile(path, 'utf-8');
    expect(content).toBe('new content');
  });
});

// ---------------------------------------------------------------------------
// generateAndSaveWeeklySummary (full pipeline)
// ---------------------------------------------------------------------------

describe('generateAndSaveWeeklySummary', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
    mockInvoke.mockReset();
    resetModel();
  });

  afterEach(async () => {
    if (tmpDir) {
      await rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('generates and saves weekly summary from daily summaries', async () => {
    // Set up daily summaries for 2026-W10 (March 2-8)
    await _writeDailySummary(tmpDir, '2026-03-02', _makeDailySummaryContent('2026-03-02'));
    await _writeDailySummary(tmpDir, '2026-03-03', _makeDailySummaryContent('2026-03-03'));

    const llmOutput = `## Week in Review

The developer worked on two features this week.

## Highlights

- Completed feature A and feature B

## Patterns

- Consistent progress each day`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const result = await generateAndSaveWeeklySummary('2026-W10', tmpDir);

    expect(result.saved).toBe(true);
    expect(result.path).toContain('2026-W10.md');
    expect(result.dayCount).toBe(2);
    expect(result.errors).toEqual([]);

    // Verify file was written
    const content = await readFile(result.path, 'utf-8');
    expect(content).toContain('# Weekly Summary — 2026-W10');
    expect(content).toContain('two features');
  });

  it('returns skipped when no daily summaries exist', async () => {
    const result = await generateAndSaveWeeklySummary('2026-W10', tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('no daily summaries');
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('returns skipped when weekly summary already exists', async () => {
    const weeklyDir = join(tmpDir, 'journal', 'summaries', 'weekly');
    await mkdir(weeklyDir, { recursive: true });
    await writeFile(join(weeklyDir, '2026-W10.md'), 'existing summary', 'utf-8');

    const result = await generateAndSaveWeeklySummary('2026-W10', tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('already exists');
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('regenerates when --force is used', async () => {
    const weeklyDir = join(tmpDir, 'journal', 'summaries', 'weekly');
    await mkdir(weeklyDir, { recursive: true });
    await writeFile(join(weeklyDir, '2026-W10.md'), 'old summary', 'utf-8');

    await _writeDailySummary(tmpDir, '2026-03-02', _makeDailySummaryContent('2026-03-02'));

    const llmOutput = `## Week in Review

New weekly narrative.

## Highlights

- New highlight

## Patterns

No notable patterns this week.`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const result = await generateAndSaveWeeklySummary('2026-W10', tmpDir, { force: true });

    expect(result.saved).toBe(true);
    const content = await readFile(result.path, 'utf-8');
    expect(content).toContain('New weekly narrative');
  });
});
