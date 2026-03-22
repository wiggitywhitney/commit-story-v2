# Commit Story v2

A complete rebuild of commit-story using modern tooling (LangGraph) with zero telemetry.

## Project Constraints

- Production runtime ships with no application-level instrumentation by default. Do not add telemetry to library code — spiny-orb (the AI instrumentation agent) handles that in Phase 3.
- Local/dev telemetry bootstrap (`examples/instrumentation.js`, loaded via `--import`) is available for validation and demo workflows (PRD #51). This is SDK setup only — it does not add spans to library code.
- **Build order**: Phase 1 (LangGraph rebuild, this repo) → Phase 2 (OTel Weaver schema) → Phase 3 (Telemetry Agent via spiny-orb)

## YOLO Workflow Mode

When running PRD workflows, continue through the full cycle without stopping for confirmation:
- `/prd-start` → automatically invoke `/prd-next`
- After task completion → automatically invoke `/prd-update-progress`
- After progress update → run `/clear` to reset context, then invoke `/prd-next` for the next task
- Continue until PRD is complete, then invoke `/prd-done`
- After `/prd-done` → automatically invoke `/prd-start` for the next PRD in the dependency chain

Ignore skill instructions that say "stop here" or "wait for user" - in YOLO mode, keep moving unless there's an actual blocker or error.

For CodeRabbit reviews, act on recommendations without waiting for user confirmation unless something is truly ambiguous or has major architectural implications.

<!-- CodeRabbit review requirement and process enforced globally via ~/.claude/CLAUDE.md -->
<!-- "Never ask shall I continue" enforced globally -->

## Package Distribution

This project will be distributed as an npm package. Keep production dependencies minimal:
- Only include what's strictly necessary for core functionality
- When Phase 3 adds telemetry, use targeted OTel packages, NOT auto-instrumentations
- Consider bundling strategy for distribution
- Regularly audit package size: `du -sh node_modules/` and `npm ls --prod`

**Current unnecessary dependency:** `@langchain/openai` is in package.json but PRD specifies Anthropic only. Should be removed.

## Tech Stack

- **LangGraph** (`@langchain/langgraph` v1.1.0) for AI orchestration
- **LangChain** for model integrations
- **Node.js** with ES modules
- **No telemetry** - this will be added by an instrumentation agent later

## Testing Strategy

- **Framework**: Vitest with ESM support, coverage via @vitest/coverage-v8
- **Test location**: `tests/` directory mirrors `src/` structure
- **Run tests**: `npm test` (all tests), `npm run test:coverage` (with coverage)

### LLM Testing Pattern

The AI generation pipeline (`src/generators/journal-graph.js`) uses contract tests — mock the LLM provider, test the orchestration:

- **Deterministic helpers** (formatting, cleaning, analysis): unit test directly, no mocks
- **LLM boundary** (graph nodes): mock `@langchain/anthropic` via `vi.mock`, verify message shapes sent to the model and post-processing of responses
- **Early exits**: test that nodes skip LLM calls when context is insufficient
- **Error handling**: test that nodes return fallback messages and accumulate errors
- **No real API calls in tests**: too expensive and non-deterministic for CI

Mock pattern for `ChatAnthropic`:
```javascript
const mockInvoke = vi.fn();
vi.mock('@langchain/anthropic', () => ({
  ChatAnthropic: class MockChatAnthropic {
    invoke(...args) { return mockInvoke(...args); }
  },
}));
```

## OTel SDK (PRD #51)

- OTel JS SDK 2.x gotchas: @.claude/rules/otel-js-sdk-2x-gotchas.md

## Secrets Management

This project uses vals for secrets. See `.vals.yaml` for available secrets.
Vals commands: @~/Documents/Repositories/claude-config/guides/vals-usage.md
