// ABOUTME: Tests for journal-manager — formatTimestamp, formatJournalEntry, and file I/O operations
// ABOUTME: Covers timestamp formatting, entry structure, append behavior, and directory creation

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  formatTimestamp,
  formatJournalEntry,
  saveJournalEntry,
  discoverReflections,
} from '../../src/managers/journal-manager.js';

/**
 * Helper: create minimal commit metadata
 */
function _makeCommit({
  shortHash = 'abc123d',
  hash = 'abc123def456',
  author = 'Test User',
  timestamp = new Date('2026-02-21T10:15:32Z'),
  message = 'feat: add testing',
  diff = 'diff --git a/src/app.js b/src/app.js\n+console.log("hello");',
} = {}) {
  return { shortHash, hash, author, timestamp, message, diff };
}

/**
 * Helper: create minimal AI-generated sections
 */
function _makeSections({
  summary = 'Added new testing functionality.',
  dialogue = '> "Let us write some tests" - Developer',
  technicalDecisions = '- Chose Vitest over Jest for ESM support',
} = {}) {
  return { summary, dialogue, technicalDecisions };
}

describe('formatTimestamp', () => {
  it('formats a date as localized time string', () => {
    const date = new Date('2026-02-21T10:15:32Z');
    const result = formatTimestamp(date);

    // Should include time components and AM/PM
    expect(result).toMatch(/\d{1,2}:\d{2}:\d{2}\s[AP]M/);
  });

  it('includes timezone abbreviation', () => {
    const date = new Date('2026-02-21T10:15:32Z');
    const result = formatTimestamp(date);

    // Should end with timezone (e.g., "CDT", "EST", "UTC", "GMT+1")
    expect(result).toMatch(/[A-Z]{2,5}[+-]?\d*$/);
  });
});

describe('formatJournalEntry', () => {
  it('includes commit hash in header', () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('## ');
    expect(result).toContain('Commit: abc123d');
  });

  it('includes summary section', () => {
    const sections = _makeSections({ summary: 'Unique summary content here.' });
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('### Summary');
    expect(result).toContain('Unique summary content here.');
  });

  it('includes dialogue section', () => {
    const sections = _makeSections({ dialogue: '> "Testing is important"' });
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('### Development Dialogue');
    expect(result).toContain('> "Testing is important"');
  });

  it('includes technical decisions section', () => {
    const sections = _makeSections({ technicalDecisions: '- Chose Vitest' });
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('### Technical Decisions');
    expect(result).toContain('- Chose Vitest');
  });

  it('shows fallback text for missing sections', () => {
    const sections = { summary: null, dialogue: null, technicalDecisions: null };
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('[No summary generated]');
    expect(result).toContain('[No dialogue extracted]');
    expect(result).toContain('[No decisions identified]');
  });

  it('extracts files changed from diff', () => {
    const sections = _makeSections();
    const commit = _makeCommit({
      diff: 'diff --git a/src/app.js b/src/app.js\n+line1\ndiff --git a/tests/test.js b/tests/test.js\n+line2',
    });
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('**Files Changed**');
    expect(result).toContain('- src/app.js');
    expect(result).toContain('- tests/test.js');
  });

  it('counts changed lines from diff', () => {
    const sections = _makeSections();
    const commit = _makeCommit({
      diff: 'diff --git a/file.js b/file.js\n--- a/file.js\n+++ b/file.js\n+added line\n-removed line\n+another added',
    });
    const result = formatJournalEntry(sections, commit);

    // 3 changed lines: +added, -removed, +another
    expect(result).toContain('**Lines Changed**: ~3 lines');
  });

  it('includes commit message', () => {
    const sections = _makeSections();
    const commit = _makeCommit({ message: 'feat: add amazing feature\n\nDetailed description here' });
    const result = formatJournalEntry(sections, commit);

    // Only first line of message
    expect(result).toContain('**Message**: "feat: add amazing feature"');
  });

  it('includes entry separator at the end', () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit);

    expect(result).toContain('═══════════════════════════════════════');
  });

  it('includes reflections section when reflections provided', () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const reflections = [
      { timestamp: new Date('2026-02-21T09:45:00Z'), content: 'This approach feels right.' },
    ];
    const result = formatJournalEntry(sections, commit, reflections);

    expect(result).toContain('### Developer Reflections');
    expect(result).toContain('This approach feels right.');
  });

  it('omits reflections section when no reflections', () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const result = formatJournalEntry(sections, commit, []);

    expect(result).not.toContain('### Developer Reflections');
  });

  it('handles empty diff gracefully', () => {
    const sections = _makeSections();
    const commit = _makeCommit({ diff: '' });
    const result = formatJournalEntry(sections, commit);

    expect(result).not.toContain('**Files Changed**');
    expect(result).not.toContain('**Lines Changed**');
  });

  it('handles null diff gracefully', () => {
    const sections = _makeSections();
    const commit = _makeCommit({ diff: null });
    const result = formatJournalEntry(sections, commit);

    expect(result).not.toContain('**Files Changed**');
  });
});

describe('saveJournalEntry', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'journal-manager-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('creates journal entry file with correct content', async () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const entryPath = await saveJournalEntry(sections, commit, [], tmpDir);

    expect(entryPath).toContain('journal/entries/2026-02/2026-02-21.md');

    const content = readFileSync(entryPath, 'utf-8');
    expect(content).toContain('Commit: abc123d');
    expect(content).toContain('Added new testing functionality.');
  });

  it('creates necessary directories', async () => {
    const sections = _makeSections();
    const commit = _makeCommit();
    const entryPath = await saveJournalEntry(sections, commit, [], tmpDir);

    // File should exist (directory was created)
    const content = readFileSync(entryPath, 'utf-8');
    expect(content.length).toBeGreaterThan(0);
  });

  it('appends to existing file', async () => {
    const sections1 = _makeSections({ summary: 'First entry summary.' });
    const commit1 = _makeCommit({ shortHash: 'first11', timestamp: new Date('2026-02-21T09:00:00Z') });

    const sections2 = _makeSections({ summary: 'Second entry summary.' });
    const commit2 = _makeCommit({ shortHash: 'second2', timestamp: new Date('2026-02-21T10:00:00Z') });

    await saveJournalEntry(sections1, commit1, [], tmpDir);
    await saveJournalEntry(sections2, commit2, [], tmpDir);

    // Both entries in same file (same date)
    const entryPath = join(tmpDir, 'journal/entries/2026-02/2026-02-21.md');
    const content = readFileSync(entryPath, 'utf-8');
    expect(content).toContain('First entry summary.');
    expect(content).toContain('Second entry summary.');
  });

  it('skips duplicate entries (exact hash match)', async () => {
    const sections = _makeSections();
    const commit = _makeCommit({ shortHash: 'abc123d' });

    await saveJournalEntry(sections, commit, [], tmpDir);
    await saveJournalEntry(sections, commit, [], tmpDir); // duplicate

    const entryPath = join(tmpDir, 'journal/entries/2026-02/2026-02-21.md');
    const content = readFileSync(entryPath, 'utf-8');

    // Should only appear once
    const matches = content.match(/Commit: abc123d/g);
    expect(matches).toHaveLength(1);
  });

  it('skips semantic duplicates (same timestamp and message, different hash)', async () => {
    const sections = _makeSections();
    const commit1 = _makeCommit({
      shortHash: 'orignal',
      message: 'feat: add feature',
      timestamp: new Date('2026-02-21T10:15:32Z'),
    });
    const commit2 = _makeCommit({
      shortHash: 'cherryp',
      message: 'feat: add feature',
      timestamp: new Date('2026-02-21T10:15:32Z'),
    });

    await saveJournalEntry(sections, commit1, [], tmpDir);
    await saveJournalEntry(sections, commit2, [], tmpDir); // semantic duplicate

    const entryPath = join(tmpDir, 'journal/entries/2026-02/2026-02-21.md');
    const content = readFileSync(entryPath, 'utf-8');

    // Only the first entry should be present
    expect(content).toContain('Commit: orignal');
    expect(content).not.toContain('Commit: cherryp');
  });
});

describe('discoverReflections', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'journal-reflections-test-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('discovers reflections within time window', async () => {
    // Create reflections directory and file
    const reflDir = join(tmpDir, 'journal/reflections/2026-02');
    mkdirSync(reflDir, { recursive: true });

    const content = [
      '## 10:00:00 AM CST - First reflection',
      'This is the first reflection content.',
      '',
      '═══════════════════════════════════════',
      '',
      '## 11:00:00 AM CST - Second reflection',
      'This is the second reflection content.',
    ].join('\n');

    writeFileSync(join(reflDir, '2026-02-21.md'), content, 'utf-8');

    const start = new Date(2026, 1, 21, 0, 0, 0);
    const end = new Date(2026, 1, 21, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty('timestamp');
    expect(result[0]).toHaveProperty('content');
  });

  it('returns empty array when no reflections directory exists', async () => {
    const start = new Date(2026, 1, 21, 0, 0, 0);
    const end = new Date(2026, 1, 21, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    expect(result).toEqual([]);
  });

  it('returns empty array for time window with no matching reflections', async () => {
    const reflDir = join(tmpDir, 'journal/reflections/2026-02');
    mkdirSync(reflDir, { recursive: true });

    const content = [
      '## 10:00:00 AM CST - Morning thought',
      'Some reflection content.',
    ].join('\n');

    writeFileSync(join(reflDir, '2026-02-21.md'), content, 'utf-8');

    // Time window is for a different day
    const start = new Date(2026, 1, 22, 0, 0, 0);
    const end = new Date(2026, 1, 22, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    expect(result).toEqual([]);
  });

  it('sorts reflections chronologically', async () => {
    const reflDir = join(tmpDir, 'journal/reflections/2026-02');
    mkdirSync(reflDir, { recursive: true });

    const content = [
      '## 2:00:00 PM CST - Later thought',
      'Later content.',
      '',
      '═══════════════════════════════════════',
      '',
      '## 10:00:00 AM CST - Earlier thought',
      'Earlier content.',
    ].join('\n');

    writeFileSync(join(reflDir, '2026-02-21.md'), content, 'utf-8');

    const start = new Date(2026, 1, 21, 0, 0, 0);
    const end = new Date(2026, 1, 21, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    expect(result.length).toBe(2);
    expect(result[0].timestamp.getTime()).toBeLessThanOrEqual(result[1].timestamp.getTime());
  });

  it('spans across month boundaries', async () => {
    // Create reflections in two different months
    const janDir = join(tmpDir, 'journal/reflections/2026-01');
    const febDir = join(tmpDir, 'journal/reflections/2026-02');
    mkdirSync(janDir, { recursive: true });
    mkdirSync(febDir, { recursive: true });

    writeFileSync(join(janDir, '2026-01-31.md'),
      '## 11:00:00 PM CST - January thought\nJan content.', 'utf-8');
    writeFileSync(join(febDir, '2026-02-01.md'),
      '## 8:00:00 AM CST - February thought\nFeb content.', 'utf-8');

    const start = new Date(2026, 0, 31, 0, 0, 0);
    const end = new Date(2026, 1, 1, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    // Should find reflections across both months
    expect(result.length).toBe(2);
  });

  it('ignores non-md files in reflections directory', async () => {
    const reflDir = join(tmpDir, 'journal/reflections/2026-02');
    mkdirSync(reflDir, { recursive: true });

    writeFileSync(join(reflDir, '2026-02-21.md'),
      '## 10:00:00 AM CST - Valid reflection\nContent here.', 'utf-8');
    writeFileSync(join(reflDir, 'notes.txt'), 'Not a reflection', 'utf-8');

    const start = new Date(2026, 1, 21, 0, 0, 0);
    const end = new Date(2026, 1, 21, 23, 59, 59);

    const result = await discoverReflections(start, end, tmpDir);
    // Should only find reflections from .md files with valid date names
    for (const r of result) {
      expect(r.filePath).toMatch(/\.md$/);
    }
  });
});
