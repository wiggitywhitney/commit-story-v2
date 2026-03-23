// ABOUTME: Tests for summary-detector.js — gap detection for unsummarized journal days, weeks, and months
// ABOUTME: Uses temp directories with fixture entries and summaries to test detection logic

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  findUnsummarizedDays,
  findUnsummarizedWeeks,
  findUnsummarizedMonths,
  getDaysWithEntries,
  getDaysWithDailySummaries,
} from '../../src/utils/summary-detector.js';

// ---------------------------------------------------------------------------
// Fixture helpers
// ---------------------------------------------------------------------------

let tmpDir;

function setupTmpDir() {
  tmpDir = mkdtempSync(join(tmpdir(), 'summary-detector-test-'));
}

function teardownTmpDir() {
  if (tmpDir) {
    rmSync(tmpDir, { recursive: true });
    tmpDir = null;
  }
}

function writeEntry(dateStr, content = '# Entry\n\nSome work') {
  const [year, month] = dateStr.split('-');
  const dir = join(tmpDir, 'journal', 'entries', `${year}-${month}`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${dateStr}.md`), content, 'utf-8');
}

function writeSummary(dateStr, content = '# Summary\n\nSome summary') {
  const dir = join(tmpDir, 'journal', 'summaries', 'daily');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${dateStr}.md`), content, 'utf-8');
}

function writeWeeklySummary(weekStr, content = '# Weekly Summary\n\nSome weekly summary') {
  const dir = join(tmpDir, 'journal', 'summaries', 'weekly');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${weekStr}.md`), content, 'utf-8');
}

function writeMonthlySummary(monthStr, content = '# Monthly Summary\n\nSome monthly summary') {
  const dir = join(tmpDir, 'journal', 'summaries', 'monthly');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${monthStr}.md`), content, 'utf-8');
}

// ---------------------------------------------------------------------------
// getDaysWithEntries
// ---------------------------------------------------------------------------

describe('getDaysWithEntries', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('returns empty array when no entries directory exists', async () => {
    const result = await getDaysWithEntries(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns empty array when entries directory is empty', async () => {
    mkdirSync(join(tmpDir, 'journal', 'entries'), { recursive: true });
    const result = await getDaysWithEntries(tmpDir);
    expect(result).toEqual([]);
  });

  it('finds entries across multiple year-month directories', async () => {
    writeEntry('2026-01-15');
    writeEntry('2026-02-03');
    writeEntry('2026-02-22');

    const result = await getDaysWithEntries(tmpDir);
    expect(result).toEqual(['2026-01-15', '2026-02-03', '2026-02-22']);
  });

  it('returns dates sorted in ascending order', async () => {
    writeEntry('2026-03-01');
    writeEntry('2026-01-15');
    writeEntry('2026-02-10');

    const result = await getDaysWithEntries(tmpDir);
    expect(result).toEqual(['2026-01-15', '2026-02-10', '2026-03-01']);
  });

  it('ignores non-date files in entries directories', async () => {
    writeEntry('2026-02-22');
    const dir = join(tmpDir, 'journal', 'entries', '2026-02');
    writeFileSync(join(dir, 'notes.txt'), 'not a date', 'utf-8');

    const result = await getDaysWithEntries(tmpDir);
    expect(result).toEqual(['2026-02-22']);
  });
});

// ---------------------------------------------------------------------------
// findUnsummarizedDays
// ---------------------------------------------------------------------------

describe('findUnsummarizedDays', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('returns empty array when no entries exist', async () => {
    const result = await findUnsummarizedDays(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns all entry dates when no summaries exist', async () => {
    writeEntry('2026-02-20');
    writeEntry('2026-02-21');
    writeEntry('2026-02-22');

    const result = await findUnsummarizedDays(tmpDir);
    expect(result).toEqual(['2026-02-20', '2026-02-21', '2026-02-22']);
  });

  it('excludes dates that already have summaries', async () => {
    writeEntry('2026-02-20');
    writeEntry('2026-02-21');
    writeEntry('2026-02-22');
    writeSummary('2026-02-20');

    const result = await findUnsummarizedDays(tmpDir);
    expect(result).toEqual(['2026-02-21', '2026-02-22']);
  });

  it('returns empty array when all dates are summarized', async () => {
    writeEntry('2026-02-20');
    writeEntry('2026-02-21');
    writeSummary('2026-02-20');
    writeSummary('2026-02-21');

    const result = await findUnsummarizedDays(tmpDir);
    expect(result).toEqual([]);
  });

  it('excludes today from results (today is not yet complete)', async () => {
    // Use local date (not UTC) to match getTodayString() in summary-detector
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    writeEntry(todayStr);
    // Also write a past entry to verify it IS included
    writeEntry('2026-01-01');

    const result = await findUnsummarizedDays(tmpDir);
    expect(result).not.toContain(todayStr);
    expect(result).toContain('2026-01-01');
  });

  it('filters to only days before a given cutoff date', async () => {
    writeEntry('2026-02-18');
    writeEntry('2026-02-19');
    writeEntry('2026-02-20');
    writeEntry('2026-02-21');

    // Only get unsummarized days before Feb 20
    const result = await findUnsummarizedDays(tmpDir, { before: '2026-02-20' });
    expect(result).toEqual(['2026-02-18', '2026-02-19']);
  });

  it('handles mixed summarized and unsummarized with cutoff', async () => {
    writeEntry('2026-02-18');
    writeEntry('2026-02-19');
    writeEntry('2026-02-20');
    writeSummary('2026-02-18');

    const result = await findUnsummarizedDays(tmpDir, { before: '2026-02-21' });
    expect(result).toEqual(['2026-02-19', '2026-02-20']);
  });

  it('skips days with no entries (weekends, vacations)', async () => {
    // Entries on Mon, Tue, Thu — no Wed (vacation/skip)
    writeEntry('2026-02-16'); // Mon
    writeEntry('2026-02-17'); // Tue
    // No Wed entry
    writeEntry('2026-02-19'); // Thu

    const result = await findUnsummarizedDays(tmpDir);
    // Should only return days that HAVE entries, not fill gaps
    expect(result).toEqual(['2026-02-16', '2026-02-17', '2026-02-19']);
  });
});

// ---------------------------------------------------------------------------
// getDaysWithDailySummaries
// ---------------------------------------------------------------------------

describe('getDaysWithDailySummaries', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('returns empty array when no summaries directory exists', async () => {
    const result = await getDaysWithDailySummaries(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns sorted dates from daily summaries directory', async () => {
    writeSummary('2026-02-22');
    writeSummary('2026-02-20');
    writeSummary('2026-02-21');

    const result = await getDaysWithDailySummaries(tmpDir);
    expect(result).toEqual(['2026-02-20', '2026-02-21', '2026-02-22']);
  });
});

// ---------------------------------------------------------------------------
// findUnsummarizedWeeks
// ---------------------------------------------------------------------------

describe('findUnsummarizedWeeks', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('returns empty array when no daily summaries exist', async () => {
    const result = await findUnsummarizedWeeks(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns week strings for weeks with daily summaries but no weekly summary', async () => {
    // 2026-02-16 is a Monday in week 2026-W08
    writeSummary('2026-02-16');
    writeSummary('2026-02-17');
    // 2026-02-23 is a Monday in week 2026-W09
    writeSummary('2026-02-23');

    const result = await findUnsummarizedWeeks(tmpDir);
    expect(result).toContain('2026-W08');
    expect(result).toContain('2026-W09');
  });

  it('excludes weeks that already have weekly summaries', async () => {
    writeSummary('2026-02-16'); // W08
    writeSummary('2026-02-23'); // W09
    writeWeeklySummary('2026-W08');

    const result = await findUnsummarizedWeeks(tmpDir);
    expect(result).not.toContain('2026-W08');
    expect(result).toContain('2026-W09');
  });

  it('excludes the current week', async () => {
    // Write a daily summary for today's week — should be excluded
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    writeSummary(todayStr);

    // Also write one for a past week to verify it IS included
    writeSummary('2026-01-05'); // W02

    const result = await findUnsummarizedWeeks(tmpDir);
    // The current week should not appear
    const { getISOWeekString } = await import('../../src/utils/journal-paths.js');
    const currentWeek = getISOWeekString(today);
    expect(result).not.toContain(currentWeek);
    expect(result).toContain('2026-W02');
  });

  it('returns sorted results', async () => {
    writeSummary('2026-02-23'); // W09
    writeSummary('2026-02-16'); // W08
    writeSummary('2026-01-05'); // W02

    const result = await findUnsummarizedWeeks(tmpDir);
    // Should be ascending
    for (let i = 1; i < result.length; i++) {
      expect(result[i] > result[i - 1]).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// findUnsummarizedMonths
// ---------------------------------------------------------------------------

describe('findUnsummarizedMonths', () => {
  beforeEach(setupTmpDir);
  afterEach(teardownTmpDir);

  it('returns empty array when no weekly summaries exist', async () => {
    const result = await findUnsummarizedMonths(tmpDir);
    expect(result).toEqual([]);
  });

  it('returns month strings for months with weekly summaries but no monthly summary', async () => {
    // W06 (Feb 2-8) and W08 (Feb 16-22) are in February 2026
    writeWeeklySummary('2026-W06');
    writeWeeklySummary('2026-W08');
    // W02 (Jan 5-11) is in January 2026
    writeWeeklySummary('2026-W02');

    const result = await findUnsummarizedMonths(tmpDir);
    expect(result).toContain('2026-01');
    expect(result).toContain('2026-02');
  });

  it('excludes months that already have monthly summaries', async () => {
    writeWeeklySummary('2026-W02'); // January
    writeWeeklySummary('2026-W06'); // February
    writeMonthlySummary('2026-01');

    const result = await findUnsummarizedMonths(tmpDir);
    expect(result).not.toContain('2026-01');
    expect(result).toContain('2026-02');
  });

  it('excludes the current month', async () => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

    // Write a weekly summary that falls in the current month
    const { getISOWeekString } = await import('../../src/utils/journal-paths.js');
    const currentWeek = getISOWeekString(today);
    writeWeeklySummary(currentWeek);

    // Also write one for a past month
    writeWeeklySummary('2026-W02'); // January

    const result = await findUnsummarizedMonths(tmpDir);
    expect(result).not.toContain(currentMonth);
    expect(result).toContain('2026-01');
  });

  it('returns sorted results', async () => {
    writeWeeklySummary('2026-W08'); // February
    writeWeeklySummary('2026-W02'); // January
    writeWeeklySummary('2025-W50'); // December 2025

    const result = await findUnsummarizedMonths(tmpDir);
    for (let i = 1; i < result.length; i++) {
      expect(result[i] > result[i - 1]).toBe(true);
    }
  });

  it('handles boundary weeks correctly (week spanning two months)', async () => {
    // W09 (Feb 23-Mar 1) spans Feb and March
    // It should count for both months if we use overlap logic,
    // but for simplicity we use the Monday's month
    writeWeeklySummary('2026-W09');

    const result = await findUnsummarizedMonths(tmpDir);
    // W09 Monday is Feb 23, so it's a February week
    expect(result).toContain('2026-02');
  });
});
