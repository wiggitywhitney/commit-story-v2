#!/usr/bin/env node
/**
 * Test script to verify LangChain/Anthropic connection works.
 * Run with: teller run -- /opt/homebrew/bin/node scripts/test-connection.js
 * Or with .env file: node scripts/test-connection.js
 */

import { ChatAnthropic } from '@langchain/anthropic';
import { config } from '../src/utils/config.js';

console.log('Testing LangChain/Anthropic connection...');
console.log('Model:', config.model);

const llm = new ChatAnthropic({
  model: config.model,
  temperature: 0,
  maxRetries: 2,
});

try {
  const response = await llm.invoke([
    ['system', 'You are a helpful assistant. Respond in exactly one sentence.'],
    ['human', 'Say hello and confirm you are Claude.'],
  ]);

  console.log('\n✅ Connection successful!');
  console.log('Response:', response.content);
  console.log('\nToken usage:', response.usage_metadata);
} catch (error) {
  console.error('\n❌ Connection failed:', error.message);
  process.exit(1);
}
