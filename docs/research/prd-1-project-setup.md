# PRD #1 Project Setup Research

Research findings for commit-story v2 project initialization.

---

## 1. LangGraph/LangChain Package Versions

### Current Latest Versions (January 2026)

| Package | Latest | In package.json | Action |
|---------|--------|-----------------|--------|
| `@langchain/langgraph` | 1.1.2 | ^1.1.0 | OK (will resolve to latest) |
| `@langchain/core` | 1.1.17 | ^1.1.15 | OK (will resolve to latest) |
| `@langchain/anthropic` | 1.3.12 | ^1.3.10 | OK (will resolve to latest) |
| `dotenv` | 17.2.3 | ^17.0.0 | OK (will resolve to latest) |

**Verdict**: Current package.json version ranges are correct and will install latest compatible versions.

### Package Compatibility Notes

- `@langchain/anthropic` requires `@langchain/core` as a peer dependency
- `@langchain/langgraph` works with any `@langchain/core` >=0.3.x
- All packages use ES modules natively

---

## 2. @langchain/anthropic Setup Patterns

### Basic ChatAnthropic Usage

```javascript
import { ChatAnthropic } from "@langchain/anthropic";

const llm = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",
  temperature: 0,
  maxTokens: undefined,  // Let model decide
  maxRetries: 2,
});

// Simple invocation
const response = await llm.invoke([
  ["system", "You are a helpful assistant."],
  ["human", "Hello!"],
]);

console.log(response.content);
```

### Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Your Anthropic API key

Optional:
- `ANTHROPIC_BASE_URL` - Custom API endpoint (for proxies)

### Model Options for Commit Story

| Model | Use Case | Cost |
|-------|----------|------|
| `claude-3-5-haiku-latest` | Journal generation (recommended) | ~$0.25/1M tokens |
| `claude-3-5-sonnet-latest` | Complex analysis if needed | ~$3/1M tokens |

**Recommendation**: Use `claude-3-5-haiku-latest` as the PRD specifies - cost-effective for summarization tasks.

---

## 3. LangGraph StateGraph Patterns

### Basic StateGraph Setup

```javascript
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Define state schema using Annotation
const JournalState = Annotation.Root({
  commitData: Annotation(),
  claudeChat: Annotation(),
  summary: Annotation(),
  dialogue: Annotation(),
  technicalDecisions: Annotation(),
});

// Create nodes as async functions
async function collectGitData(state) {
  // ... collect git data
  return { commitData: data };
}

async function generateSummary(state) {
  // ... generate summary
  return { summary: text };
}

// Build and compile graph
const workflow = new StateGraph(JournalState)
  .addNode("collectGit", collectGitData)
  .addNode("collectClaude", collectClaudeData)
  .addNode("generateSummary", generateSummary)
  .addEdge(START, "collectGit")
  .addEdge("collectGit", "collectClaude")
  .addEdge("collectClaude", "generateSummary")
  .addEdge("generateSummary", END)
  .compile();

// Invoke
const result = await workflow.invoke({});
```

### Key Concepts

- **Annotation.Root()**: Defines the state schema
- **Nodes**: Async functions that receive state and return partial state updates
- **Edges**: Define flow between nodes (can be conditional)
- **compile()**: Creates executable graph

---

## 4. Node.js ES Modules Best Practices

### package.json Configuration

```json
{
  "type": "module",
  "main": "src/index.js",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Import/Export Patterns

```javascript
// Named exports (preferred)
export function doSomething() { }
export const CONFIG = { };

// Default exports (use sparingly)
export default class JournalGenerator { }

// Imports
import { doSomething, CONFIG } from './utils.js';
import JournalGenerator from './journal-generator.js';

// IMPORTANT: Always include .js extension in relative imports
import { helper } from './helpers/helper.js';  // ✅
import { helper } from './helpers/helper';     // ❌ Won't work
```

### Top-Level Await

ES modules support top-level await (Node 14.8+):

```javascript
// Works in ES modules
const config = await loadConfig();
export { config };
```

### __dirname Replacement

```javascript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

## 5. Secrets Management

### Approach: vals + dotenv

**Development (local)**:
- Use `vals` to inject secrets from GCP Secret Manager
- Command: `vals exec -f .vals.yaml -- node scripts/test-connection.js`
- Or export to shell: `eval $(vals env -f .vals.yaml)`

**Distribution (users)**:
- Use `dotenv` to load from `.env` file
- Users create `.env` with their `ANTHROPIC_API_KEY`

### .env.example Template

```bash
# Anthropic API Key (required)
ANTHROPIC_API_KEY=your-api-key-here

# Optional: Override default model
# ANTHROPIC_MODEL=claude-3-5-haiku-latest

# Optional: Journal output directory
# JOURNAL_DIR=./journal
```

### Config Loader Pattern

```javascript
import 'dotenv/config';

export const config = {
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  model: process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-latest',
  journalDir: process.env.JOURNAL_DIR || './journal',
};

// Validate required config
if (!config.anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is required');
}
```

---

## 6. Recommendations for Implementation

### Milestone 1: Initialize Project
- [x] package.json already exists with correct versions
- [ ] Run `npm install` to install dependencies
- [ ] Verify installation succeeds

### Milestone 2: Directory Structure
Create these directories:
```
src/
├── collectors/      # git-collector.js, claude-collector.js
├── integrators/     # context-integrator.js
├── generators/      # LangGraph workflows
├── managers/        # journal-manager.js
├── mcp/            # MCP server and tools
└── utils/          # config.js, helpers
scripts/            # install-hook.sh
journal/            # Output (gitignored)
```

### Milestone 3: Configuration
1. Create `src/utils/config.js` with validation
2. Create `.env.example` for distribution users
3. Test with `teller run` locally

### Milestone 4: AI Connection Test
1. Create `scripts/test-connection.js`
2. Simple ChatAnthropic invocation
3. Verify response and token usage

---

## Summary

The existing package.json is well-configured. Key findings:
1. Package versions are correct - just run `npm install`
2. Use `ChatAnthropic` with `claude-3-5-haiku-latest`
3. LangGraph StateGraph provides clean orchestration
4. Always use `.js` extensions in ES module imports
5. Use teller for dev secrets, dotenv for distribution
