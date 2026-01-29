# PRD #5 Research: AI Generation with LangGraph

## Research Date: January 2026

## Summary

This document covers LangGraph StateGraph API patterns, Claude Haiku 4.5 configuration, and prompt engineering best practices for the journal generation feature.

---

## 1. LangGraph StateGraph API (v1.1.0)

### Overview

LangGraph models workflows as graphs with three key components:
- **State**: Shared data structure representing application snapshot
- **Nodes**: Functions that process state and return updates
- **Edges**: Determine execution flow between nodes

### StateGraph Class

```javascript
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// State definition using Annotation (recommended approach)
const JournalState = Annotation.Root({
  context: Annotation(),
  summary: Annotation(),
  dialogue: Annotation(),
  technicalDecisions: Annotation(),
  errors: Annotation({
    reducer: (left, right) => [...(left || []), ...(right || [])],
    default: () => [],
  }),
});

// Create graph
const graph = new StateGraph(JournalState);
```

### Key Methods

1. **addNode(key, action)**: Register a node function
2. **addEdge(start, end)**: Connect nodes (can be arrays for fan-in)
3. **compile()**: Finalize graph for execution

### Parallel Execution Pattern

Multiple outgoing edges from START cause parallel execution. LangGraph waits for all parallel branches to complete before proceeding to the next node.

```javascript
// Parallel execution pattern
graph
  .addNode("summary", summaryNode)
  .addNode("technical", technicalNode)
  .addNode("dialogue", dialogueNode)
  .addEdge(START, "summary")      // summary runs in parallel...
  .addEdge(START, "technical")    // ...with technical
  .addEdge("summary", "dialogue") // dialogue waits for both
  .addEdge("technical", "dialogue")
  .addEdge("dialogue", END);
```

### State Reducers

For accumulating values from parallel branches (like errors), use reducer functions:

```javascript
errors: Annotation({
  reducer: (left, right) => [...(left || []), ...(right || [])],
  default: () => [],
}),
```

### Sources
- [StateGraph API Reference](https://langchain-ai.github.io/langgraphjs/reference/classes/langgraph.StateGraph.html)
- [Parallel Nodes in LangGraph](https://medium.com/@gmurro/parallel-nodes-in-langgraph-managing-concurrent-branches-with-the-deferred-execution-d7e94d03ef78)
- [LangGraph GitHub](https://github.com/langchain-ai/langgraph)

---

## 2. @langchain/anthropic ChatAnthropic Configuration

### Installed Version

Package.json shows: `@langchain/anthropic: ^1.3.10`

### Configuration Options

```javascript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic({
  model: "claude-3-5-haiku-latest",  // Model identifier
  temperature: 0,                     // Determinism (0-1)
  maxTokens: 1024,                   // Max output tokens
  maxRetries: 2,                      // Retry attempts
  // apiKey: process.env.ANTHROPIC_API_KEY,  // Optional if env var set
  // stopSequences: ["---"],          // Optional stop sequences
});
```

### Key Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `model` | string | Model identifier (e.g., "claude-3-5-haiku-latest") |
| `temperature` | number | Randomness control (0 = deterministic) |
| `maxTokens` | number | Maximum tokens to generate |
| `maxRetries` | number | Number of retry attempts on failure |
| `apiKey` | string | API key (defaults to ANTHROPIC_API_KEY env var) |
| `stopSequences` | string[] | Sequences that stop generation |

### Invocation

```javascript
// Simple string prompt
const response = await model.invoke("Summarize this text...");

// Structured messages
const response = await model.invoke([
  { role: "system", content: "You are a technical writer." },
  { role: "user", content: "Summarize this commit..." },
]);
```

### Sources
- [ChatAnthropic - LangChain Docs](https://docs.langchain.com/oss/javascript/integrations/chat/anthropic)
- [@langchain/anthropic - npm](https://www.npmjs.com/package/@langchain/anthropic)

---

## 3. Claude Haiku 4.5 Capabilities

### Model Identifier
- **Latest**: `claude-3-5-haiku-latest` (alias for current version)
- **Specific**: `claude-3-5-haiku-20241022` (pinned version)

### Context Window & Limits
- **Input**: 200,000 tokens context window
- **Output**: Up to 64,000 tokens (8x increase from Haiku 3.5)

### Pricing (Claude Developer Platform)

| Token Type | Cost |
| --- | --- |
| Input | $1 per million tokens |
| Output | $5 per million tokens |

**Cost Optimizations**:
- Prompt caching: Up to 90% savings
- Batch processing: 50% savings

### Performance
- **SWE-bench Verified**: 73.3% (one of the best coding models)
- **Computer Use**: 50.7% success rate
- Matches Sonnet 4 performance at ~1/3 the cost

### Capabilities
- Text and image processing
- Extended thinking (complex reasoning)
- Context awareness (knows remaining context budget)
- Computer use (screenshot, mouse, keyboard)

### Best Use Cases for Journal Generation
- Summarization tasks (strong performance)
- Information extraction
- Cost-effective for every-commit usage
- Fast response times

### Sources
- [Claude Haiku 4.5 Deep Dive](https://caylent.com/blog/claude-haiku-4-5-deep-dive-cost-capabilities-and-the-multi-agent-opportunity)
- [Anthropic Claude Haiku](https://www.anthropic.com/claude/haiku)
- [Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

## 4. Prompt Engineering Best Practices

### Step-Based Prompting (from v1 learnings)

Guide AI through analysis before asking for output:

```text
You have been given development context for a git commit.

Step 1: Analyze the git diff to understand what changed
Step 2: Review the chat messages for WHY these changes were made
Step 3: Identify the key narrative arc (problem → solution)
Step 4: Write a 2-3 sentence summary focusing on the "why"

Context:
{context}

Write your summary:
```

### Key Principles

1. **Don't state goal first**: Causes rushing to completion
2. **Explicit steps**: Guides thorough analysis
3. **Include examples**: Shows expected format
4. **Set constraints**: Token limits, quote counts
5. **Process over task**: "Follow these steps" not "Generate this output"

### Prompt Structure for Each Node

**Summary Node**:
- Input: Full context (commit + chat)
- Focus: WHY changes were made
- Output: 2-3 sentence narrative

**Dialogue Node**:
- Input: Context + summary (to avoid redundancy)
- Focus: Human quotes revealing intent
- Output: 2-4 formatted quotes

**Technical Node**:
- Input: Full context
- Focus: Architecture/implementation decisions
- Output: Bullet points with status

---

## 5. Implementation Recommendations

### Graph Structure

```javascript
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ChatAnthropic } from "@langchain/anthropic";

// Lazy model initialization
let model;
function getModel() {
  if (!model) {
    model = new ChatAnthropic({
      model: "claude-3-5-haiku-latest",
      maxTokens: 2048,
      temperature: 0,
    });
  }
  return model;
}

// State definition
const JournalState = Annotation.Root({
  context: Annotation(),
  summary: Annotation(),
  dialogue: Annotation(),
  technicalDecisions: Annotation(),
  errors: Annotation({
    reducer: (left, right) => [...(left || []), ...(right || [])],
    default: () => [],
  }),
});
```

### Error Handling Strategy

Each node should catch errors and add to `errors` array rather than throwing:

```javascript
async function summaryNode(state) {
  try {
    const result = await getModel().invoke([...]);
    return { summary: result.content };
  } catch (error) {
    return {
      summary: "[Generation failed]",
      errors: [`Summary generation failed: ${error.message}`],
    };
  }
}
```

### Token Budget Considerations

For journal generation with typical context:
- Commit metadata: ~100-500 tokens
- Diff (truncated): Up to 50,000 tokens
- Chat messages: Up to 80,000 tokens
- **Total input per node**: ~130,000 tokens max

Well within Haiku 4.5's 200k context window.

### Estimated Cost per Journal Entry

Assuming average context of 10,000 tokens and 500 tokens output per node:
- 3 nodes × 10,000 input = 30,000 input tokens = $0.03
- 3 nodes × 500 output = 1,500 output tokens = $0.0075
- **Total**: ~$0.04 per journal entry

---

## 6. Breaking Changes from v1 Patterns

### No Significant Breaking Changes

The LangGraph API has remained stable. Key differences from potential cluster-whisperer patterns:

1. **Annotation API**: Now recommended over raw channel definitions
2. **State typing**: TypeScript-first approach with better inference
3. **Compile options**: More configuration available at compile time

### Migration Notes

If migrating from older LangGraph:
- Replace `channels` config with `Annotation.Root()`
- Use `Annotation()` for simple state values
- Add reducers explicitly for accumulated values

---

## 7. Decision Summary

| Decision | Choice | Rationale |
| --- | --- | --- |
| Model | claude-3-5-haiku-latest | Cost-effective, fast, sufficient quality |
| State definition | Annotation API | Recommended, type-safe approach |
| Error handling | Graceful degradation | Capture errors in state, don't crash |
| Temperature | 0 | Deterministic outputs for consistency |
| Max tokens | 2048 per node | Sufficient for summaries, allows headroom |
