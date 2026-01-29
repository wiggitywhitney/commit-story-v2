#!/usr/bin/env node
/**
 * Test script for Claude collector
 * Run with: node scripts/test-claude-collector.js
 */

import {
  getClaudeProjectsDir,
  encodeProjectPath,
  getClaudeProjectPath,
  findJSONLFiles,
  parseJSONLFile,
  filterMessages,
  groupBySession,
  collectChatMessages,
} from '../src/collectors/claude-collector.js';

console.log('Testing Claude Collector...\n');

// Use the current repo as test subject
const repoPath = process.cwd();

try {
  // Test getClaudeProjectsDir
  console.log('=== getClaudeProjectsDir() ===');
  const projectsDir = getClaudeProjectsDir();
  console.log('Projects dir:', projectsDir);

  // Test encodeProjectPath
  console.log('\n=== encodeProjectPath() ===');
  const encoded = encodeProjectPath(repoPath);
  console.log('Repo path:', repoPath);
  console.log('Encoded:', encoded);

  // Test getClaudeProjectPath
  console.log('\n=== getClaudeProjectPath() ===');
  const projectPath = getClaudeProjectPath(repoPath);
  console.log('Project path:', projectPath || 'Not found');

  if (!projectPath) {
    console.log('\nNo Claude project directory found for this repo.');
    console.log('This is expected if no Claude Code sessions exist for this project.');
    process.exit(0);
  }

  // Test findJSONLFiles
  console.log('\n=== findJSONLFiles() ===');
  const jsonlFiles = findJSONLFiles(projectPath);
  console.log('Found', jsonlFiles.length, 'JSONL files:');
  for (const file of jsonlFiles.slice(0, 5)) {
    console.log('  -', file.split('/').pop());
  }
  if (jsonlFiles.length > 5) {
    console.log('  ... and', jsonlFiles.length - 5, 'more');
  }

  // Test parseJSONLFile with first file
  if (jsonlFiles.length > 0) {
    console.log('\n=== parseJSONLFile() ===');
    const messages = parseJSONLFile(jsonlFiles[0]);
    console.log('Parsed', messages.length, 'messages from first file');
    if (messages.length > 0) {
      const sample = messages[0];
      console.log('Sample message fields:', Object.keys(sample).join(', '));
      console.log('Sample type:', sample.type);
      console.log('Sample sessionId:', sample.sessionId);
    }
  }

  // Test collectChatMessages with a recent time window
  console.log('\n=== collectChatMessages() ===');
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const chatData = await collectChatMessages(repoPath, now, oneDayAgo);
  console.log('Time window: last 24 hours');
  console.log('Total messages:', chatData.messageCount);
  console.log('Unique sessions:', chatData.sessionCount);

  if (chatData.messageCount > 0) {
    console.log('\nSession breakdown:');
    for (const [sessionId, sessionMsgs] of chatData.sessions) {
      console.log(`  Session ${sessionId.slice(0, 8)}...: ${sessionMsgs.length} messages`);
    }

    console.log('\nMessage type distribution:');
    const typeCounts = { user: 0, assistant: 0, other: 0 };
    for (const msg of chatData.messages) {
      if (msg.type === 'user') typeCounts.user++;
      else if (msg.type === 'assistant') typeCounts.assistant++;
      else typeCounts.other++;
    }
    console.log('  User messages:', typeCounts.user);
    console.log('  Assistant messages:', typeCounts.assistant);
    if (typeCounts.other > 0) console.log('  Other:', typeCounts.other);
  }

  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
