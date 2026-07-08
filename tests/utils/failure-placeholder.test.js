// ABOUTME: Tests for the shared failure-placeholder detection helper
// ABOUTME: Verifies bracketed-marker matching used to identify stale, regenerable content

import { describe, it, expect } from 'vitest';
import { isFailurePlaceholder } from '../../src/utils/failure-placeholder.js';

describe('isFailurePlaceholder', () => {
  it('returns true when content contains "generation failed"', () => {
    expect(isFailurePlaceholder('[Monthly summary generation failed]')).toBe(true);
  });

  it('returns true when content contains "extraction failed"', () => {
    expect(isFailurePlaceholder('[Dialogue extraction failed]')).toBe(true);
  });

  it('returns false for real content', () => {
    expect(isFailurePlaceholder('The team refactored the auth module today.')).toBe(false);
  });

  it('returns false when real narrative content mentions the phrase without brackets', () => {
    expect(isFailurePlaceholder('The nightly build had a generation failed error that we tracked down.')).toBe(false);
  });

  it('returns false for empty or missing content', () => {
    expect(isFailurePlaceholder('')).toBe(false);
    expect(isFailurePlaceholder(undefined)).toBe(false);
    expect(isFailurePlaceholder(null)).toBe(false);
  });
});
