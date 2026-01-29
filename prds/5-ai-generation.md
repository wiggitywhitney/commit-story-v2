# PRD #5: AI Generation (LangGraph)

**GitHub Issue**: [#5](https://github.com/wiggitywhitney/commit-story-v2/issues/5)
**Status**: Pending
**Priority**: High
**Dependencies**: #1 (Project Setup), #4 (Context Integration)

## Problem Statement

Need to generate journal sections (summary, dialogue, technical decisions) from collected context using AI. The orchestration should be declarative and observable for the future instrumentation agent.

## Solution Overview

Build a LangGraph StateGraph that:
1. Runs summary and technical decisions in parallel (no dependency)
2. Runs dialogue extraction after summary (uses summary for context)
3. Uses Claude Haiku for all generation
4. Provides clear node boundaries for future instrumentation

## LangGraph Architecture

```
START
  │
  ├──────────────────┬─────────────────┐
  │                  │                 │
  ▼                  ▼                 │
[summary]      [technical]             │
  │                  │                 │
  ├──────────────────┘                 │
  │                                    │
  ▼                                    │
[dialogue] ◄───────────────────────────┘
  │
  ▼
 END
```

- **summary** + **technical**: Run in parallel (no data dependency)
- **dialogue**: Runs after summary (uses summary to avoid redundancy)

## Success Criteria

- [ ] LangGraph StateGraph defined with three nodes
- [ ] Summary generation produces narrative overview
- [ ] Dialogue extraction captures human quotes
- [ ] Technical decisions identifies key decisions
- [ ] Parallel execution works correctly
- [ ] Error handling doesn't crash entire generation

## Implementation Milestones

### Milestone 0: Research (Required First)
- [ ] Research current LangGraph StateGraph API and patterns
- [ ] Check @langchain/anthropic ChatAnthropic configuration options
- [ ] Review Claude Haiku capabilities, context window, and pricing
- [ ] Research LangGraph parallel execution patterns
- [ ] Check for any breaking changes from cluster-whisperer patterns
- [ ] Review current prompt engineering best practices for summarization
- [ ] Document findings in `docs/research/prd-5-ai-generation.md`

**Output**: Research document with LangGraph patterns, model configuration, and prompt strategies

---

### Milestone 1: LangGraph Setup
**Pre-requisite**: Read `docs/research/prd-5-ai-generation.md` before starting
- [ ] Create `src/generators/journal-graph.js`
- [ ] Define state schema (input context, output sections)
- [ ] Create StateGraph with three nodes
- [ ] Configure parallel execution for summary + technical

### Milestone 2: Summary Generator Node
- [ ] Create `src/generators/nodes/summary-node.js`
- [ ] Design prompt for narrative summary
- [ ] Process context into concise overview
- [ ] Handle empty context gracefully

### Milestone 3: Dialogue Extraction Node
- [ ] Create `src/generators/nodes/dialogue-node.js`
- [ ] Design prompt for quote extraction
- [ ] Use summary to avoid repetition
- [ ] Format as Human/Assistant dialogue

### Milestone 4: Technical Decisions Node
- [ ] Create `src/generators/nodes/technical-node.js`
- [ ] Design prompt for decision identification
- [ ] Categorize decisions (architecture, implementation, trade-off)
- [ ] Include decision status (made, discussed, deferred)

### Milestone 5: Graph Compilation and Execution
- [ ] Compile StateGraph
- [ ] Implement `generateJournalSections(context)` function
- [ ] Handle partial failures (one node fails, others succeed)
- [ ] Return combined sections

## API Design

```javascript
// src/generators/journal-graph.js

import { StateGraph, START, END } from "@langchain/langgraph";

/**
 * State flowing through the graph
 */
interface JournalState {
  // Input
  context: Context;

  // Outputs (populated by nodes)
  summary?: string;
  dialogue?: string;
  technicalDecisions?: string;

  // Metadata
  errors?: string[];
}

/**
 * Generate all journal sections from context
 * @param {Context} context - Gathered context from integrator
 * @returns {Promise<JournalSections>}
 */
export async function generateJournalSections(context) {
  return {
    summary: string,
    dialogue: string,
    technicalDecisions: string,
    generatedAt: Date
  };
}
```

## Prompt Design Principles

From v1 learnings:
1. **Step-based prompts**: Guide AI through analysis before output
2. **Don't state goal first**: Causes rushing to completion
3. **Include examples**: Show expected format
4. **Explicit constraints**: Token limits, quote counts

### Summary Prompt Structure
```
You have been given development context for a git commit.

Step 1: Analyze the git diff to understand what changed
Step 2: Review the chat messages for WHY these changes were made
Step 3: Identify the key narrative arc (problem → solution)
Step 4: Write a 2-3 sentence summary focusing on the "why"

Context:
{context}

Write your summary:
```

### Dialogue Prompt Structure
```
You have been given chat messages from a development session.

The summary of this work is: {summary}

Step 1: Identify messages where the human explains their thinking
Step 2: Select 2-4 quotes that reveal intent, decisions, or insights
Step 3: Ensure quotes don't repeat what's in the summary
Step 4: Format as "Human:" followed by the quote

Extract the dialogue:
```

### Technical Decisions Prompt Structure
```
You have been given development context including code changes and discussion.

Step 1: Identify decisions about architecture, libraries, or approaches
Step 2: Note whether each was made, discussed, or deferred
Step 3: Include brief rationale when available
Step 4: Format as bullet points with decision status

Extract technical decisions:
```

## Design Decisions

### DD-001: LangGraph StateGraph over Manual Orchestration
**Decision**: Use LangGraph's StateGraph instead of hand-coded async
**Rationale**:
- Declarative flow is visible and understandable
- Clean node boundaries for future instrumentation
- Built-in support for parallel execution
- Matches cluster-whisperer pattern

### DD-002: Claude Haiku for All Nodes
**Decision**: Use `claude-3-5-haiku-latest` for all generation
**Rationale**:
- Summarization doesn't need heavy reasoning
- Cost-effective for every-commit usage
- Fast execution
- Can upgrade to Sonnet if quality lacking

### DD-003: Summary Before Dialogue
**Decision**: Dialogue node receives summary to avoid redundancy
**Rationale**:
- Prevents dialogue from repeating summary content
- Provides context for better quote selection
- Small additional latency acceptable

### DD-004: Graceful Degradation
**Decision**: Partial failures don't crash generation
**Rationale**:
- Better to have 2/3 sections than nothing
- Error captured in metadata
- User can still get value from partial result

## LangChain/LangGraph Code Pattern

```javascript
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, START, END } from "@langchain/langgraph";

// Model setup (lazy initialization)
let model;
function getModel() {
  if (!model) {
    model = new ChatAnthropic({
      model: "claude-3-5-haiku-latest",
      maxTokens: 1024,
    });
  }
  return model;
}

// Node functions
async function summaryNode(state) {
  const result = await getModel().invoke([...]);
  return { ...state, summary: result.content };
}

async function technicalNode(state) {
  const result = await getModel().invoke([...]);
  return { ...state, technicalDecisions: result.content };
}

async function dialogueNode(state) {
  // Has access to state.summary from previous node
  const result = await getModel().invoke([...]);
  return { ...state, dialogue: result.content };
}

// Graph definition
const graph = new StateGraph({ channels: {...} })
  .addNode("summary", summaryNode)
  .addNode("technical", technicalNode)
  .addNode("dialogue", dialogueNode)
  .addEdge(START, "summary")
  .addEdge(START, "technical")
  .addEdge("summary", "dialogue")
  .addEdge("technical", "dialogue")
  .addEdge("dialogue", END);

export const journalGraph = graph.compile();
```

## Notes

- No telemetry in Phase 1 (instrumentation agent adds later)
- The graph structure is the key observability hook
- Keep prompts readable - they'll be shown in the demo
- Model can be changed via configuration if needed
