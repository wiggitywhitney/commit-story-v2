# PRD #4: Context Integration & Filtering

**GitHub Issue**: [#4](https://github.com/wiggitywhitney/commit-story-v2/issues/4)
**Status**: Complete
**Priority**: High
**Dependencies**: #2 (Git Collector), #3 (Claude Collector)

## Problem Statement

Need to orchestrate the collectors and apply filtering before passing context to AI generation. This includes message filtering (remove noise), token management, and sensitive data redaction.

## Solution Overview

Build a context integrator that:
1. Orchestrates git and Claude collectors
2. Filters noisy messages (tool_use, tool_result, isMeta)
3. Preserves context capture tool calls (per v1 DD-014)
4. Manages token budget for AI prompts
5. Redacts sensitive data (API keys, secrets)

## Key Learnings from v1

From PRD-32 (Journal File Filtering):
- Message filtering removes tool calls, system messages, empty content
- BUT context capture tool calls must pass through (v1 DD-014)

From PRD-18 (Context Capture Tool):
- Context integrates via chat flow, not file parsing
- `journal_capture_context` tool calls should NOT be filtered

From v1 Architecture:
- Filtering happens in two stages: collector (time/project) and integrator (noise/tokens)
- Token budget management prevents prompt overflow
- Sensitive data filter catches API keys, JWTs, etc.

## Success Criteria

- [x] Orchestrate both collectors with proper timing
- [x] Filter noisy messages while preserving context captures
- [x] Calculate metadata (message counts, session counts)
- [x] Apply token budget limits
- [x] Redact sensitive data patterns
- [x] Return structured context for AI generation

## Implementation Milestones

### Milestone 0: Research (Required First)
- [x] Research current token counting approaches for Claude models
- [x] Review sensitive data detection patterns (any new standards?)
- [x] Check if there are established libraries for PII detection in Node.js
- [x] Research context window sizes for Claude Haiku
- [x] Document findings in `docs/research/prd-4-context-integration.md`

**Output**: Research document with token estimation approaches and filtering patterns

---

### Milestone 1: Collector Orchestration
**Pre-requisite**: Read `docs/research/prd-4-context-integration.md` before starting
- [x] Create `src/integrators/context-integrator.js`
- [x] Implement `gatherContextForCommit(commitRef)` function
- [x] Call git collector for commit data
- [x] Use previous commit time for Claude collector time window
- [x] Handle missing previous commit (first commit case)

### Milestone 2: Message Filtering
- [x] Create `src/integrators/filters/message-filter.js`
- [x] Filter `tool_use` messages (EXCEPT context capture)
- [x] Filter `tool_result` messages
- [x] Filter `isMeta` messages
- [x] Filter empty content messages
- [x] Preserve human/assistant text content

### Milestone 3: Token Management
- [x] Create `src/integrators/filters/token-filter.js`
- [x] Estimate token count for context
- [x] Apply budget limits (configurable)
- [x] Truncate large diffs if needed
- [x] Summarize when over budget

### Milestone 4: Sensitive Data Filtering
- [x] Create `src/integrators/filters/sensitive-filter.js`
- [x] Detect and redact API key patterns
- [x] Detect and redact JWT tokens
- [x] Detect and redact email patterns (configurable)
- [x] Replace with `[REDACTED]` placeholder

### Milestone 5: Context Assembly
- [x] Combine filtered data into unified context object
- [x] Calculate metadata (counts, time windows)
- [x] Structure for AI generation consumption

## API Design

```javascript
// src/integrators/context-integrator.js

/**
 * Gather all context for a commit
 * @param {string} commitRef - Git commit reference
 * @param {object} options - Configuration options
 * @returns {Promise<Context>}
 */
export async function gatherContextForCommit(commitRef = 'HEAD', options = {}) {
  return {
    commit: {
      hash: string,
      shortHash: string,
      message: string,
      author: string,
      timestamp: Date,
      diff: string,
      isMerge: boolean
    },
    chat: {
      messages: FilteredMessage[],    // Flat filtered messages
      sessions: Map<string, FilteredMessage[]>,  // Grouped by session
      messageCount: number,
      sessionCount: number
    },
    metadata: {
      previousCommitTime: Date | null,
      timeWindow: { start: Date, end: Date },
      tokenEstimate: number,
      filterStats: {
        totalMessages: number,
        filteredMessages: number,
        preservedMessages: number
      }
    }
  };
}
```

## Message Filtering Rules

| Message Type | Filter? | Reason |
|--------------|---------|--------|
| `tool_use` (general) | YES | Noise - tool execution details |
| `tool_use` (context_capture) | NO | Preserve context captures (DD-014) |
| `tool_result` | YES | Noise - tool output |
| `isMeta: true` | YES | System messages |
| Empty content | YES | No value |
| Human text input | NO | Core dialogue |
| Assistant text response | NO | Core dialogue |

## Sensitive Data Patterns

```javascript
const SENSITIVE_PATTERNS = [
  // API Keys
  /(?:api[_-]?key|apikey|api_secret)['":\s]*['""]?([a-zA-Z0-9_-]{20,})['""]?/gi,

  // AWS Keys
  /AKIA[0-9A-Z]{16}/g,

  // JWT Tokens
  /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/g,

  // Generic secrets
  /(?:password|secret|token)['":\s]*['""]?([^\s'"]{8,})['""]?/gi
];
```

## Design Decisions

### DD-001: Preserve Context Capture Tool Calls
**Decision**: Do NOT filter `journal_capture_context` tool calls
**Rationale**:
- v1 PRD-18 DD-014 established context flows via chat, not file parsing
- Context captures in chat provide temporal position
- Filtering would lose valuable context

### DD-002: Two-Stage Filtering
**Decision**: Collectors filter by time/project; integrator filters by content
**Rationale**:
- Clean separation of concerns
- Collectors are reusable for other purposes
- Content filtering rules may change independent of collection

### DD-003: Token Budget Strategy
**Decision**: Truncate diffs first, then older messages
**Rationale**:
- Diffs are often the largest content
- Recent messages more relevant than old
- Keep chat context coherent by preserving recent

### DD-004: Redact, Don't Remove
**Decision**: Replace sensitive data with `[REDACTED]`, don't delete messages
**Rationale**:
- Preserves context structure
- AI knows something was there
- Easier to debug issues

## Notes

- This is the central orchestration point for data collection
- No telemetry in Phase 1 (instrumentation agent adds later)
- Token estimation is approximate - using character-based heuristic
- Keep filter rules configurable for future customization
