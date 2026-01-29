#!/usr/bin/env node
/**
 * Test script for journal manager
 * Run with: node scripts/test-journal-manager.js
 */

import { mkdir, rm, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import {
  formatJournalEntry,
  formatTimestamp,
  saveJournalEntry,
  discoverReflections,
} from '../src/managers/journal-manager.js';
import {
  getJournalEntryPath,
  getReflectionPath,
  ensureDirectory,
} from '../src/utils/journal-paths.js';

const TEST_DIR = './test-journal-output';

console.log('Testing Journal Manager...\n');

// Test 1: Format timestamp
console.log('=== Test 1: Format Timestamp ===');
const testDate = new Date('2026-01-15T10:15:32');
const formatted = formatTimestamp(testDate);
console.log('Formatted timestamp:', formatted);
console.log('');

// Test 2: Format journal entry
console.log('=== Test 2: Format Journal Entry ===');
const mockSections = {
  summary: 'Added user authentication with JWT tokens. This change enables secure API access and session management.',
  dialogue: '**Human**: "We need to make sure the tokens expire after 24 hours."\n**Assistant**: "I\'ll add a configurable TTL with 24h default."',
  technicalDecisions: '- **JWT over sessions**: Stateless authentication scales better\n- **Redis for blacklist**: Fast token invalidation',
};

const mockCommit = {
  shortHash: 'abc1234',
  hash: 'abc1234def5678901234567890abcdef12345678',
  author: 'Whitney Lee',
  timestamp: new Date('2026-01-15T10:15:32'),
  filesChanged: 5,
};

const entry = formatJournalEntry(mockSections, mockCommit);
console.log('Formatted entry:');
console.log('---');
console.log(entry);
console.log('---\n');

// Test 3: Format with reflections
console.log('=== Test 3: Format Entry with Reflections ===');
const mockReflections = [
  {
    timestamp: new Date('2026-01-15T09:45:00'),
    content: 'Realized the issue was in the async handling. Need to await the token validation.',
  },
  {
    timestamp: new Date('2026-01-15T10:00:00'),
    content: 'JWT approach is cleaner than I thought. Should document the token flow.',
  },
];

const entryWithReflections = formatJournalEntry(mockSections, mockCommit, mockReflections);
console.log('Entry with reflections:');
console.log('---');
console.log(entryWithReflections);
console.log('---\n');

// Test 4: Save journal entry to file
console.log('=== Test 4: Save Journal Entry ===');
try {
  // Clean up test directory
  await rm(TEST_DIR, { recursive: true, force: true });
  await mkdir(TEST_DIR, { recursive: true });

  const savedPath = await saveJournalEntry(mockSections, mockCommit, mockReflections, TEST_DIR);
  console.log('Saved to:', savedPath);

  // Verify file was created
  const content = await readFile(savedPath, 'utf-8');
  console.log('File created successfully!');
  console.log('File length:', content.length, 'bytes');
  console.log('');

  // Save another entry to test appending
  const mockCommit2 = {
    ...mockCommit,
    shortHash: 'def5678',
    hash: 'def5678901234567890abcdef1234567890abcdef',
    timestamp: new Date('2026-01-15T14:30:00'),
  };

  const mockSections2 = {
    summary: 'Added rate limiting to prevent API abuse. Uses sliding window algorithm.',
    dialogue: '**Human**: "What window size should we use?"\n**Assistant**: "1 minute sliding window is standard."',
    technicalDecisions: '- **Sliding window**: More accurate than fixed window\n- **Redis counters**: Atomic increments',
  };

  await saveJournalEntry(mockSections2, mockCommit2, [], TEST_DIR);
  console.log('Appended second entry!');

  const content2 = await readFile(savedPath, 'utf-8');
  const entryCount = (content2.match(/═══════════════════════════════════════/g) || []).length;
  console.log('Entry count in file:', entryCount);
  console.log('');
} catch (error) {
  console.error('Save test failed:', error.message);
  console.error(error.stack);
}

// Test 5: Discover reflections
console.log('=== Test 5: Discover Reflections ===');
try {
  // Create test reflection file (use explicit local time to avoid timezone issues)
  const reflectionPath = getReflectionPath(new Date('2026-01-15T12:00:00'), TEST_DIR);
  await ensureDirectory(reflectionPath);

  const testReflectionContent = `## 9:45:00 AM CDT - Manual Reflection

Realized the issue was in the async handling. Need to await the token validation.

═══════════════════════════════════════

## 10:00:00 AM CDT - Manual Reflection

JWT approach is cleaner than I thought. Should document the token flow.

═══════════════════════════════════════

## 3:30:00 PM CDT - Manual Reflection

This one should be outside the time window and not discovered.

═══════════════════════════════════════
`;

  const { writeFile } = await import('node:fs/promises');
  await writeFile(reflectionPath, testReflectionContent, 'utf-8');
  console.log('Created test reflection file at:', reflectionPath);

  // Discover reflections in time window (9 AM to 11 AM)
  const startTime = new Date('2026-01-15T09:00:00');
  const endTime = new Date('2026-01-15T11:00:00');

  const discovered = await discoverReflections(startTime, endTime, TEST_DIR);
  console.log('Discovered', discovered.length, 'reflections in time window');

  for (const reflection of discovered) {
    console.log('-', formatTimestamp(reflection.timestamp), ':', reflection.content.substring(0, 50) + '...');
  }
  console.log('');
} catch (error) {
  console.error('Discovery test failed:', error.message);
  console.error(error.stack);
}

// Test 6: Empty reflections directory
console.log('=== Test 6: Empty Reflections Directory ===');
try {
  const startTime = new Date('2025-01-01T00:00:00');
  const endTime = new Date('2025-01-01T23:59:59');

  const discovered = await discoverReflections(startTime, endTime, TEST_DIR);
  console.log('Discovered', discovered.length, 'reflections (expected: 0)');
  console.log('');
} catch (error) {
  console.error('Empty directory test failed:', error.message);
}

// Cleanup
console.log('=== Cleanup ===');
try {
  await rm(TEST_DIR, { recursive: true, force: true });
  console.log('Cleaned up test directory');
} catch (error) {
  console.error('Cleanup failed:', error.message);
}

console.log('\n✅ All journal manager tests completed!');
