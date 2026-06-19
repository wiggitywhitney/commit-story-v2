// ABOUTME: Tests for monthly summary functions in summary-manager.js
// ABOUTME: Covers month boundaries, reading weekly summaries, formatting, saving, and full pipeline

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
  getMonthBoundaries,
  readMonthWeeklySummaries,
  formatMonthlySummary,
  saveMonthlySummary,
  generateAndSaveMonthlySummary,
} from '../../src/managers/summary-manager.js';
import { resetModel } from '../../src/generators/summary-graph.js';

// ---------------------------------------------------------------------------
// Helper factories
// ---------------------------------------------------------------------------

async function _setupTmpDir() {
  return await mkdtemp(join(tmpdir(), 'commit-story-monthly-test-'));
}

async function _writeWeeklySummary(basePath, weekStr, content) {
  const dir = join(basePath, 'journal', 'summaries', 'weekly');
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${weekStr}.md`), content, 'utf-8');
}

function _makeWeeklySummaryContent(weekStr) {
  return `# Weekly Summary — ${weekStr}

## Week in Review

The developer worked on features during ${weekStr}.

## Highlights

- Shipped feature for ${weekStr}

## Patterns

- Consistent progress`;
}

// ---------------------------------------------------------------------------
// getMonthBoundaries
// ---------------------------------------------------------------------------

describe('getMonthBoundaries', () => {
  it('returns first and last day for a normal month', () => {
    const { firstDay, lastDay } = getMonthBoundaries('2026-02');
    expect(firstDay.getFullYear()).toBe(2026);
    expect(firstDay.getMonth()).toBe(1); // February
    expect(firstDay.getDate()).toBe(1);
    expect(lastDay.getDate()).toBe(28);
  });

  it('handles months with 31 days', () => {
    const { firstDay, lastDay } = getMonthBoundaries('2026-03');
    expect(lastDay.getDate()).toBe(31);
  });

  it('handles leap year February', () => {
    const { firstDay, lastDay } = getMonthBoundaries('2028-02');
    expect(lastDay.getDate()).toBe(29);
  });

  it('throws for invalid month string', () => {
    expect(() => getMonthBoundaries('2026')).toThrow('Invalid month string');
    expect(() => getMonthBoundaries('invalid')).toThrow('Invalid month string');
    expect(() => getMonthBoundaries('2026-13')).toThrow('Invalid month string');
    expect(() => getMonthBoundaries('2026-00')).toThrow('Invalid month string');
  });
});

// ---------------------------------------------------------------------------
// readMonthWeeklySummaries
// ---------------------------------------------------------------------------

describe('readMonthWeeklySummaries', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
    mockInvoke.mockReset();
    resetModel();
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('reads weekly summaries that overlap with the month', async () => {
    // February 2026: W05 (Jan 26-Feb 1), W06 (Feb 2-8), W07 (Feb 9-15), W08 (Feb 16-22), W09 (Feb 23-Mar 1)
    await _writeWeeklySummary(tmpDir, '2026-W06', _makeWeeklySummaryContent('2026-W06'));
    await _writeWeeklySummary(tmpDir, '2026-W07', _makeWeeklySummaryContent('2026-W07'));
    await _writeWeeklySummary(tmpDir, '2026-W08', _makeWeeklySummaryContent('2026-W08'));

    const summaries = await readMonthWeeklySummaries('2026-02', tmpDir);

    expect(summaries.length).toBeGreaterThanOrEqual(3);
    expect(summaries.some(s => s.weekLabel === '2026-W06')).toBe(true);
    expect(summaries.some(s => s.weekLabel === '2026-W07')).toBe(true);
    expect(summaries.some(s => s.weekLabel === '2026-W08')).toBe(true);
  });

  it('returns empty array when no weekly summaries exist', async () => {
    const summaries = await readMonthWeeklySummaries('2026-02', tmpDir);
    expect(summaries).toEqual([]);
  });

  it('assigns a week to the month containing its Monday, not its Sunday', async () => {
    // W05 2026: Mon Jan 26 - Sun Feb 1. Monday is in January → belongs to January, NOT February.
    await _writeWeeklySummary(tmpDir, '2026-W05', _makeWeeklySummaryContent('2026-W05'));

    const februarySummaries = await readMonthWeeklySummaries('2026-02', tmpDir);

    expect(februarySummaries.some(s => s.weekLabel === '2026-W05')).toBe(false);
  });

  it('does not include a week in two months when it spans a month boundary', async () => {
    // W09 2026: Mon Feb 23 - Sun Mar 1. Monday is in February → belongs to February only.
    await _writeWeeklySummary(tmpDir, '2026-W09', _makeWeeklySummaryContent('2026-W09'));

    const februarySummaries = await readMonthWeeklySummaries('2026-02', tmpDir);
    const marchSummaries = await readMonthWeeklySummaries('2026-03', tmpDir);

    expect(februarySummaries.some(s => s.weekLabel === '2026-W09')).toBe(true);
    expect(marchSummaries.some(s => s.weekLabel === '2026-W09')).toBe(false);
  });

  it('rethrows non-ENOENT errors when reading the weekly directory', async () => {
    // Create a file where the weekly directory should be — readdir on a file throws ENOTDIR, not ENOENT
    const summariesDir = join(tmpDir, 'journal', 'summaries');
    await mkdir(summariesDir, { recursive: true });
    await writeFile(join(summariesDir, 'weekly'), 'not a directory');

    await expect(readMonthWeeklySummaries('2026-02', tmpDir)).rejects.toThrow();
  });

  it('rethrows non-ENOENT errors from individual weekly file reads', async () => {
    // Create a weekly summary path as a directory — readFile on a directory throws EISDIR, not ENOENT
    const weeklyDir = join(tmpDir, 'journal', 'summaries', 'weekly');
    await mkdir(weeklyDir, { recursive: true });
    // W09's Monday is Feb 23, so it's in range for February 2026
    await mkdir(join(weeklyDir, '2026-W09.md'));

    await expect(readMonthWeeklySummaries('2026-02', tmpDir)).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// formatMonthlySummary
// ---------------------------------------------------------------------------

describe('formatMonthlySummary', () => {
  it('formats sections with correct headers', () => {
    const sections = {
      monthInReview: 'The developer focused on infrastructure all month.',
      accomplishments: '- Shipped deployment pipeline',
      growth: '- Learned K8s operator patterns',
      lookingAhead: '- Need to tackle monitoring',
    };

    const result = formatMonthlySummary(sections, '2026-02');

    expect(result).toContain('# Monthly Summary — 2026-02');
    expect(result).toContain('## Month in Review');
    expect(result).toContain('infrastructure all month');
    expect(result).toContain('## Accomplishments');
    expect(result).toContain('deployment pipeline');
    expect(result).toContain('## Growth');
    expect(result).toContain('K8s operator');
    expect(result).toContain('## Looking Ahead');
    expect(result).toContain('monitoring');
  });

  it('uses fallback text for empty sections', () => {
    const sections = {
      monthInReview: '',
      accomplishments: '',
      growth: '',
      lookingAhead: '',
    };

    const result = formatMonthlySummary(sections, '2026-02');

    expect(result).toContain('[No monthly narrative generated]');
    expect(result).toContain('No standout accomplishments this month.');
    expect(result).toContain('No notable growth signals this month.');
    expect(result).toContain('No open threads carrying into next month.');
  });
});

// ---------------------------------------------------------------------------
// saveMonthlySummary
// ---------------------------------------------------------------------------

describe('saveMonthlySummary', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('saves monthly summary to correct path', async () => {
    const content = '# Monthly Summary — 2026-02\n\nContent here.';
    const path = await saveMonthlySummary(content, '2026-02', tmpDir);

    expect(path).toContain('journal/summaries/monthly/2026-02.md');
    const saved = await readFile(path, 'utf-8');
    expect(saved).toBe(content);
  });

  it('skips when summary already exists', async () => {
    const monthlyDir = join(tmpDir, 'journal', 'summaries', 'monthly');
    await mkdir(monthlyDir, { recursive: true });
    await writeFile(join(monthlyDir, '2026-02.md'), 'existing', 'utf-8');

    const path = await saveMonthlySummary('new content', '2026-02', tmpDir);
    expect(path).toBeNull();

    // Verify original content preserved
    const content = await readFile(join(monthlyDir, '2026-02.md'), 'utf-8');
    expect(content).toBe('existing');
  });

  it('overwrites when --force is used', async () => {
    const monthlyDir = join(tmpDir, 'journal', 'summaries', 'monthly');
    await mkdir(monthlyDir, { recursive: true });
    await writeFile(join(monthlyDir, '2026-02.md'), 'existing', 'utf-8');

    const path = await saveMonthlySummary('new content', '2026-02', tmpDir, { force: true });
    expect(path).not.toBeNull();

    const content = await readFile(path, 'utf-8');
    expect(content).toBe('new content');
  });
});

// ---------------------------------------------------------------------------
// generateAndSaveMonthlySummary (full pipeline)
// ---------------------------------------------------------------------------

describe('generateAndSaveMonthlySummary', () => {
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await _setupTmpDir();
    mockInvoke.mockReset();
    resetModel();
  });

  afterEach(async () => {
    await rm(tmpDir, { recursive: true, force: true });
  });

  it('generates and saves monthly summary from weekly summaries', async () => {
    // Set up weekly summaries that overlap with February 2026
    await _writeWeeklySummary(tmpDir, '2026-W06', _makeWeeklySummaryContent('2026-W06'));
    await _writeWeeklySummary(tmpDir, '2026-W07', _makeWeeklySummaryContent('2026-W07'));
    await _writeWeeklySummary(tmpDir, '2026-W08', _makeWeeklySummaryContent('2026-W08'));

    const llmOutput = `## Month in Review

The developer worked on multiple features throughout February.

## Accomplishments

- Shipped three major features
- Improved test coverage

## Growth

- Better understanding of async patterns

## Looking Ahead

- Planning the March sprint`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const result = await generateAndSaveMonthlySummary('2026-02', tmpDir);

    expect(result.saved).toBe(true);
    expect(result.path).toContain('2026-02.md');
    expect(result.weekCount).toBeGreaterThanOrEqual(3);
    expect(result.errors).toEqual([]);

    // Verify file was written
    const content = await readFile(result.path, 'utf-8');
    expect(content).toContain('# Monthly Summary — 2026-02');
    expect(content).toContain('multiple features');
  });

  it('returns skipped when no weekly summaries exist', async () => {
    const result = await generateAndSaveMonthlySummary('2026-02', tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('no weekly summaries');
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('returns skipped when monthly summary already exists', async () => {
    const monthlyDir = join(tmpDir, 'journal', 'summaries', 'monthly');
    await mkdir(monthlyDir, { recursive: true });
    await writeFile(join(monthlyDir, '2026-02.md'), 'existing summary', 'utf-8');

    const result = await generateAndSaveMonthlySummary('2026-02', tmpDir);

    expect(result.saved).toBe(false);
    expect(result.reason).toContain('already exists');
    expect(mockInvoke).not.toHaveBeenCalled();
  });

  it('regenerates when --force is used', async () => {
    const monthlyDir = join(tmpDir, 'journal', 'summaries', 'monthly');
    await mkdir(monthlyDir, { recursive: true });
    await writeFile(join(monthlyDir, '2026-02.md'), 'old summary', 'utf-8');

    await _writeWeeklySummary(tmpDir, '2026-W06', _makeWeeklySummaryContent('2026-W06'));

    const llmOutput = `## Month in Review

New monthly narrative.

## Accomplishments

- New accomplishment

## Growth

No notable growth signals this month.

## Looking Ahead

No open threads carrying into next month.`;

    mockInvoke.mockResolvedValue({ content: llmOutput });

    const result = await generateAndSaveMonthlySummary('2026-02', tmpDir, { force: true });

    expect(result.saved).toBe(true);
    const content = await readFile(result.path, 'utf-8');
    expect(content).toContain('New monthly narrative');
  });
});
