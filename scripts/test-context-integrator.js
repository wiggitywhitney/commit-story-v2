#!/usr/bin/env node
/**
 * Test script for context integrator
 * Run with: node scripts/test-context-integrator.js
 */

import {
  gatherContextForCommit,
  formatContextForPrompt,
  getContextSummary,
} from '../src/integrators/context-integrator.js';
import { estimateTokens } from '../src/integrators/filters/token-filter.js';
import { redactSensitiveData } from '../src/integrators/filters/sensitive-filter.js';

console.log('Testing Context Integrator...\n');

try {
  // Test sensitive data redaction
  console.log('=== Sensitive Data Redaction ===');
  const testTexts = [
    'My API key is sk-ant-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz5678901234567890abcdefghijklmnop',
    'Set ANTHROPIC_API_KEY="sk-ant-test123"',
    'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    'password: mysupersecretpassword123',
    'ghp_1234567890abcdefghijABCDEFGHIJ123456',
    'Contact: user@example.com',
  ];

  for (const text of testTexts) {
    const result = redactSensitiveData(text);
    console.log('Original:', text.substring(0, 50) + '...');
    console.log('Redacted:', result.text.substring(0, 50) + '...');
    console.log('Redactions:', result.redactions.map((r) => r.type).join(', ') || 'none');
    console.log('');
  }

  // Test with email redaction enabled
  console.log('With email redaction enabled:');
  const emailResult = redactSensitiveData('Contact: user@example.com', { redactEmails: true });
  console.log('Redacted:', emailResult.text);
  console.log('');

  // Test token estimation
  console.log('=== Token Estimation ===');
  const sampleText = 'This is a sample text for token estimation testing.';
  console.log('Text:', sampleText);
  console.log('Length:', sampleText.length, 'chars');
  console.log('Estimated tokens:', estimateTokens(sampleText));
  console.log('');

  // Test full context gathering
  console.log('=== Full Context Gathering (HEAD) ===');
  const context = await gatherContextForCommit('HEAD', {
    repoPath: process.cwd(),
  });

  console.log('\n--- Context Summary ---');
  const summary = getContextSummary(context);
  console.log('Commit:', summary.commit.hash, '-', context.commit.subject?.substring(0, 50));
  console.log('Author:', summary.commit.author);
  console.log('Timestamp:', summary.commit.timestamp);
  console.log('Is Merge:', summary.commit.isMerge);
  console.log('Diff Length:', summary.commit.diffLength, 'chars');
  console.log('');

  console.log('Chat Messages:', summary.chat.messageCount);
  console.log('Chat Sessions:', summary.chat.sessionCount);
  console.log('');

  console.log('Token Estimate:', summary.metadata.tokenEstimate);
  console.log('Filter Stats:');
  console.log('  - Total messages:', summary.metadata.filterStats.totalMessages);
  console.log('  - Filtered:', summary.metadata.filterStats.filteredMessages);
  console.log('  - Preserved:', summary.metadata.filterStats.preservedMessages);
  console.log('');

  if (summary.metadata.tokenBudget) {
    console.log('Token Budget:');
    console.log('  - Diff truncated:', summary.metadata.tokenBudget.diffTruncated || false);
    console.log('  - Messages truncated:', summary.metadata.tokenBudget.messagesTruncated || false);
  }

  if (summary.metadata.sensitiveDataFilter) {
    console.log('Sensitive Data Redactions:', summary.metadata.sensitiveDataFilter.totalRedactions);
  }

  // Test prompt formatting
  console.log('\n--- Formatted Prompt Preview (first 500 chars) ---');
  const formattedPrompt = formatContextForPrompt(context);
  console.log(formattedPrompt.substring(0, 500) + '...');

  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
