#!/usr/bin/env node
/**
 * Test script for journal graph
 * Run with: node scripts/test-journal-graph.js
 *
 * Requires ANTHROPIC_API_KEY environment variable
 */

import { generateJournalSections, formatChatMessages, buildGraph } from '../src/generators/journal-graph.js';

console.log('Testing Journal Graph...\n');

// Test 1: Format chat messages
console.log('=== Test 1: Format Chat Messages ===');
const testMessages = [
  {
    type: 'user',
    timestamp: new Date().toISOString(),
    content: 'I need to add a new feature for context filtering',
  },
  {
    type: 'assistant',
    timestamp: new Date().toISOString(),
    content: 'I can help with that. Let me create a filter module.',
  },
];

const formatted = formatChatMessages(testMessages);
console.log('Formatted messages:');
console.log(formatted);
console.log('');

// Test 2: Empty messages
console.log('=== Test 2: Empty Messages ===');
const emptyFormatted = formatChatMessages([]);
console.log('Empty messages:', emptyFormatted);
console.log('');

// Test 3: Build graph
console.log('=== Test 3: Build Graph ===');
try {
  const graph = buildGraph();
  console.log('Graph compiled successfully');
  console.log('');
} catch (error) {
  console.error('Graph compilation failed:', error.message);
  process.exit(1);
}

// Test 4: Full generation (requires API key)
if (process.env.ANTHROPIC_API_KEY) {
  console.log('=== Test 4: Full Generation ===');
  console.log('(This will make API calls to Claude)');
  console.log('');

  const mockContext = {
    commit: {
      hash: 'abc123def456',
      shortHash: 'abc123d',
      message: 'feat: add context filtering for sensitive data\n\nImplement regex-based filtering for API keys and tokens.',
      subject: 'feat: add context filtering for sensitive data',
      author: 'Test User',
      authorEmail: 'test@example.com',
      timestamp: new Date(),
      diff: `diff --git a/src/filters/sensitive-filter.js b/src/filters/sensitive-filter.js
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/filters/sensitive-filter.js
@@ -0,0 +1,20 @@
+const SENSITIVE_PATTERNS = [
+  /sk-ant-[a-zA-Z0-9_-]{20,}/g,
+  /eyJ[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*\\.[a-zA-Z0-9_-]*/g,
+];
+
+export function redactSensitiveData(text) {
+  let result = text;
+  for (const pattern of SENSITIVE_PATTERNS) {
+    result = result.replace(pattern, '[REDACTED]');
+  }
+  return result;
+}`,
      isMerge: false,
      parentCount: 1,
    },
    chat: {
      messages: [
        {
          type: 'user',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          content:
            'We need to make sure API keys and JWT tokens are redacted from the journal. Can you add a sensitive data filter?',
        },
        {
          type: 'assistant',
          timestamp: new Date(Date.now() - 3500000).toISOString(),
          content:
            "I'll create a sensitive data filter using regex patterns. I'll include patterns for Anthropic API keys (sk-ant-*) and JWT tokens (eyJ...).",
        },
        {
          type: 'user',
          timestamp: new Date(Date.now() - 3400000).toISOString(),
          content:
            "Good approach. Let's use [REDACTED] as the placeholder so it's clear something was removed.",
        },
      ],
      messageCount: 3,
      sessionCount: 1,
    },
    metadata: {
      previousCommitTime: new Date(Date.now() - 86400000),
      timeWindow: {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      },
      tokenEstimate: 2500,
      filterStats: {
        totalMessages: 10,
        filteredMessages: 7,
        preservedMessages: 3,
      },
    },
  };

  try {
    console.log('Generating journal sections...');
    const startTime = Date.now();
    const result = await generateJournalSections(mockContext);
    const elapsed = Date.now() - startTime;

    console.log(`\nGeneration completed in ${elapsed}ms\n`);

    console.log('--- Summary ---');
    console.log(result.summary);
    console.log('');

    console.log('--- Dialogue ---');
    console.log(result.dialogue);
    console.log('');

    console.log('--- Technical Decisions ---');
    console.log(result.technicalDecisions);
    console.log('');

    if (result.errors && result.errors.length > 0) {
      console.log('--- Errors ---');
      for (const err of result.errors) {
        console.log(`- ${err}`);
      }
      console.log('');
    }

    console.log('Generated at:', result.generatedAt.toISOString());
    console.log('\n✅ Full generation test passed!');
  } catch (error) {
    console.error('Generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
} else {
  console.log('=== Test 4: Full Generation (SKIPPED) ===');
  console.log('Set ANTHROPIC_API_KEY environment variable to run full generation test');
  console.log('');
}

console.log('\n✅ All basic tests passed!');
