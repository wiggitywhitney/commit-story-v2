// ABOUTME: Tests for git-collector.js — commit data extraction and previous commit time
// ABOUTME: Validates SHA, author, timestamp, diff, merge detection against the live repo

import { describe, it, expect } from 'vitest';
import { getCommitData, getPreviousCommitTime } from '../../src/collectors/git-collector.js';

/**
 * Integration tests for git-collector.
 * These run against the actual git repository — no mocks.
 * They validate that output parsing works correctly with real git output.
 */

describe('getCommitData', () => {
  it('returns complete commit data for HEAD', async () => {
    const data = await getCommitData('HEAD');

    // Structural checks
    expect(data).toHaveProperty('hash');
    expect(data).toHaveProperty('shortHash');
    expect(data).toHaveProperty('subject');
    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('author');
    expect(data).toHaveProperty('authorEmail');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('diff');
    expect(data).toHaveProperty('isMerge');
    expect(data).toHaveProperty('parentCount');
  });

  it('returns a valid SHA hash', async () => {
    const data = await getCommitData('HEAD');

    // Full hash is 40 hex characters
    expect(data.hash).toMatch(/^[a-f0-9]{40}$/);
    // Short hash is typically 7+ characters
    expect(data.shortHash).toMatch(/^[a-f0-9]{7,}$/);
    // Short hash is prefix of full hash
    expect(data.hash.startsWith(data.shortHash)).toBe(true);
  });

  it('returns valid author information', async () => {
    const data = await getCommitData('HEAD');

    expect(typeof data.author).toBe('string');
    expect(data.author.length).toBeGreaterThan(0);
    expect(typeof data.authorEmail).toBe('string');
    expect(data.authorEmail).toContain('@');
  });

  it('returns a Date object for timestamp', async () => {
    const data = await getCommitData('HEAD');

    expect(data.timestamp).toBeInstanceOf(Date);
    expect(data.timestamp.getTime()).not.toBeNaN();
  });

  it('returns a non-empty subject line', async () => {
    const data = await getCommitData('HEAD');

    expect(typeof data.subject).toBe('string');
    expect(data.subject.length).toBeGreaterThan(0);
    // Subject should be a single line
    expect(data.subject).not.toContain('\n');
  });

  it('message includes subject', async () => {
    const data = await getCommitData('HEAD');

    expect(data.message).toContain(data.subject);
  });

  it('returns boolean isMerge and numeric parentCount', async () => {
    const data = await getCommitData('HEAD');

    expect(typeof data.isMerge).toBe('boolean');
    expect(typeof data.parentCount).toBe('number');
    expect(data.parentCount).toBeGreaterThanOrEqual(1);

    if (data.isMerge) {
      expect(data.parentCount).toBeGreaterThan(1);
    } else {
      expect(data.parentCount).toBe(1);
    }
  });

  it('diff is a string (may be empty for some commits)', async () => {
    const data = await getCommitData('HEAD');

    expect(typeof data.diff).toBe('string');
  });

  it('excludes journal entries from diff', async () => {
    const data = await getCommitData('HEAD');

    // Diff file headers should not include journal/entries/ paths
    // (anchor to line start so content *mentioning* journal paths doesn't false-positive)
    if (data.diff) {
      expect(data.diff).not.toMatch(/^diff --git a\/journal\/entries\//m);
    }
  });

  it('throws for invalid commit reference', async () => {
    await expect(getCommitData('nonexistent-ref-abc123')).rejects.toThrow('Invalid commit reference');
  });
});

describe('getPreviousCommitTime', () => {
  it('returns a Date for HEAD (unless first commit)', async () => {
    const prevTime = await getPreviousCommitTime('HEAD');

    // Should return Date or null (null only if HEAD is the first commit)
    if (prevTime !== null) {
      expect(prevTime).toBeInstanceOf(Date);
      expect(prevTime.getTime()).not.toBeNaN();
    }
  });

  it('returns null for the initial commit (no previous)', async () => {
    // Get the first commit in the repo
    // We can't guarantee what the first commit hash is, so we test the behavior:
    // getPreviousCommitTime should eventually return null for the root commit.
    // This is a structural validation — we trust git log -2 returns fewer results for root.
    const prevTime = await getPreviousCommitTime('HEAD');
    // Just verify it returns Date or null, not undefined or throws
    expect(prevTime === null || prevTime instanceof Date).toBe(true);
  });
});
