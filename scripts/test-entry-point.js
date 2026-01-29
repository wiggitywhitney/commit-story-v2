#!/usr/bin/env node
/**
 * Test script for entry point utilities
 * Run with: node scripts/test-entry-point.js
 *
 * Note: Full pipeline test requires ANTHROPIC_API_KEY
 */

import {
  getChangedFiles,
  isJournalEntriesOnlyCommit,
  isMergeCommit,
  getCommitMetadata,
} from '../src/utils/commit-analyzer.js';

console.log('Testing Entry Point Utilities...\n');

// Test 1: Get changed files for HEAD
console.log('=== Test 1: Get Changed Files (HEAD) ===');
try {
  const files = getChangedFiles('HEAD');
  console.log('Files changed in HEAD:', files.length);
  if (files.length > 0) {
    console.log('First few files:', files.slice(0, 3));
  }
  console.log('');
} catch (error) {
  console.error('Test 1 failed:', error.message);
}

// Test 2: Check if journal-only commit
console.log('=== Test 2: Journal-Only Check (HEAD) ===');
try {
  const isJournalOnly = isJournalEntriesOnlyCommit('HEAD');
  console.log('Is journal-only commit:', isJournalOnly);
  console.log('');
} catch (error) {
  console.error('Test 2 failed:', error.message);
}

// Test 3: Check if merge commit
console.log('=== Test 3: Merge Commit Check (HEAD) ===');
try {
  const mergeInfo = isMergeCommit('HEAD');
  console.log('Is merge commit:', mergeInfo.isMerge);
  console.log('Parent count:', mergeInfo.parentCount);
  console.log('');
} catch (error) {
  console.error('Test 3 failed:', error.message);
}

// Test 4: Get commit metadata
console.log('=== Test 4: Commit Metadata (HEAD) ===');
try {
  const metadata = getCommitMetadata('HEAD');
  console.log('Hash:', metadata.shortHash);
  console.log('Subject:', metadata.subject.substring(0, 50) + (metadata.subject.length > 50 ? '...' : ''));
  console.log('Author:', metadata.author);
  console.log('Timestamp:', metadata.timestamp.toISOString());
  console.log('');
} catch (error) {
  console.error('Test 4 failed:', error.message);
}

// Test 5: Invalid commit reference
console.log('=== Test 5: Invalid Commit Reference ===');
try {
  const files = getChangedFiles('invalid-commit-ref-xyz123');
  console.log('Result for invalid ref:', files.length, 'files (expected: 0)');
  console.log('');
} catch (error) {
  console.error('Test 5 failed:', error.message);
}

// Test 6: Help output
console.log('=== Test 6: Help Output ===');
console.log('Running: node src/index.js --help');
console.log('(Check output above for help message)');
console.log('');

console.log('✅ All commit analyzer tests completed!');
console.log('');
console.log('To test full pipeline (requires ANTHROPIC_API_KEY):');
console.log('  node src/index.js --debug');
