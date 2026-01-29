#!/usr/bin/env node
/**
 * Test script for git collector
 * Run with: node scripts/test-git-collector.js
 */

import { getCommitData, getPreviousCommitTime } from '../src/collectors/git-collector.js';

console.log('Testing Git Collector...\n');

try {
  // Test getCommitData
  console.log('=== getCommitData(HEAD) ===');
  const commitData = await getCommitData('HEAD');
  console.log('Hash:', commitData.hash);
  console.log('Short Hash:', commitData.shortHash);
  console.log('Subject:', commitData.subject);
  console.log('Author:', commitData.author);
  console.log('Email:', commitData.authorEmail);
  console.log('Timestamp:', commitData.timestamp.toISOString());
  console.log('Is Merge:', commitData.isMerge);
  console.log('Parent Count:', commitData.parentCount);
  console.log('Diff length:', commitData.diff.length, 'chars');
  console.log('Diff preview:', commitData.diff.substring(0, 200) + '...');

  // Test getPreviousCommitTime
  console.log('\n=== getPreviousCommitTime(HEAD) ===');
  const prevTime = await getPreviousCommitTime('HEAD');
  console.log('Previous commit time:', prevTime?.toISOString() || 'null (first commit)');

  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
}
