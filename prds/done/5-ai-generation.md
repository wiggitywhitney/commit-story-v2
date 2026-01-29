# PRD #5: AI Generation (LangGraph)

**GitHub Issue**: [#5](https://github.com/wiggitywhitney/commit-story-v2/issues/5)
**Status**: Complete
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

```text
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

- [x] LangGraph StateGraph defined with three nodes
- [x] Summary generation produces narrative overview
- [x] Dialogue extraction captures human quotes
- [x] Technical decisions identifies key decisions
- [x] Parallel execution works correctly
- [x] Error handling doesn't crash entire generation

## Implementation Milestones

### Milestone 0: Research (Required First)
- [x] Research current LangGraph StateGraph API and patterns
- [x] Check @langchain/anthropic ChatAnthropic configuration options
- [x] Review Claude Haiku capabilities, context window, and pricing
- [x] Research LangGraph parallel execution patterns
- [x] Check for any breaking changes from cluster-whisperer patterns
- [x] Review current prompt engineering best practices for summarization
- [x] Document findings in `docs/research/prd-5-ai-generation.md`

**Output**: Research document with LangGraph patterns, model configuration, and prompt strategies

---

### Milestone 1: LangGraph Setup
**Pre-requisite**: Read `docs/research/prd-5-ai-generation.md` before starting
- [x] Create `src/generators/journal-graph.js`
- [x] Define state schema (input context, output sections)
- [x] Create StateGraph with three nodes
- [x] Configure parallel execution for summary + technical

### Milestone 2: Summary Generator Node
- [x] Create summary node (in `src/generators/journal-graph.js`)
- [x] Design prompt for narrative summary
- [x] Process context into concise overview
- [x] Handle empty context gracefully

### Milestone 3: Dialogue Extraction Node
- [x] Create dialogue node (in `src/generators/journal-graph.js`)
- [x] Design prompt for quote extraction
- [x] Use summary to avoid repetition
- [x] Format as Human/Assistant dialogue

### Milestone 4: Technical Decisions Node
- [x] Create technical node (in `src/generators/journal-graph.js`)
- [x] Design prompt for decision identification
- [x] Categorize decisions (architecture, implementation, trade-off)
- [x] Include decision status (made, discussed, deferred)

### Milestone 5: Graph Compilation and Execution
- [x] Compile StateGraph
- [x] Implement `generateJournalSections(context)` function
- [x] Handle partial failures (one node fails, others succeed)
- [x] Return combined sections

## API Design

```javascript
// src/generators/journal-graph.js

import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

/**
 * State flowing through the graph (using Annotation API)
 */
const JournalState = Annotation.Root({
  // Input
  context: Annotation(),

  // Outputs (populated by nodes)
  summary: Annotation(),
  dialogue: Annotation(),
  technicalDecisions: Annotation(),

  // Metadata - errors use reducer to accumulate from parallel nodes
  errors: Annotation({
    reducer: (left, right) => [...(left || []), ...(right || [])],
    default: () => [],
  }),
});

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
    errors: string[],
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

### Dialogue Prompt Structure
```text
You have been given chat messages from a development session.

The summary of this work is: {summary}

Step 1: Identify messages where the human explains their thinking
Step 2: Select 2-4 quotes that reveal intent, decisions, or insights
Step 3: Ensure quotes don't repeat what's in the summary
Step 4: Format as "Human:" followed by the quote

Extract the dialogue:
```

### Technical Decisions Prompt Structure
```text
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

### DD-005: Node Names with Prefix
**Decision**: Use `generate_` prefix for node names (e.g., `generate_summary`)
**Rationale**:
- LangGraph doesn't allow node names to match state attribute names
- Prefix clearly indicates these are action nodes
- Discovered during implementation when "summary" conflicted with state.summary

### DD-006: All Nodes in Single File
**Decision**: Keep all node functions in `journal-graph.js` instead of separate files
**Rationale**:
- Nodes are small (< 50 lines each)
- Easier to see full graph structure in one place
- Reduces import complexity
- Can split later if nodes grow

## LangChain/LangGraph Code Pattern

```javascript
import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";

// Model setup (lazy initialization)
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

// State definition using Annotation API
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

// Node functions
async function summaryNode(state) {
  try {
    const result = await getModel().invoke([...]);
    return { summary: result.content };
  } catch (error) {
    return { summary: '[Generation failed]', errors: [`Summary: ${error.message}`] };
  }
}

// Graph definition - node names use prefix to avoid state conflicts
const graph = new StateGraph(JournalState)
  .addNode("generate_summary", summaryNode)
  .addNode("generate_technical", technicalNode)
  .addNode("generate_dialogue", dialogueNode)
  .addEdge(START, "generate_summary")
  .addEdge(START, "generate_technical")
  .addEdge("generate_summary", "generate_dialogue")
  .addEdge("generate_technical", "generate_dialogue")
  .addEdge("generate_dialogue", END);

export const journalGraph = graph.compile();
```

## Notes

- No telemetry in Phase 1 (instrumentation agent adds later)
- The graph structure is the key observability hook
- Keep prompts readable - they'll be shown in the demo
- Model can be changed via configuration if needed
