# PRD #1: Project Setup

**GitHub Issue**: [#1](https://github.com/wiggitywhitney/commit-story-v2/issues/1)
**Status**: Pending
**Priority**: High
**Dependencies**: None

## Problem Statement

Need to establish the foundation for commit-story v2 - a complete rebuild using LangGraph for AI orchestration. This is Phase 1 of the KubeCon EU 2026 demo: building the app with zero telemetry so an instrumentation agent can add it later.

## Solution Overview

Initialize a Node.js ES modules project with:
- LangGraph and LangChain for AI orchestration
- Anthropic SDK via LangChain for Claude Haiku
- Project structure matching v1 patterns for familiarity
- Build configuration for development and distribution

## Tech Stack Decisions

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Runtime** | Node.js 18+ | Matches v1, ES modules support |
| **AI Framework** | LangGraph + LangChain | Declarative orchestration, good observability hooks |
| **Model** | Claude 3.5 Haiku via `@langchain/anthropic` | Cost-effective, fast, thematic (Claude journaling Claude) |
| **Secrets** | vals + dotenv | vals for dev (GCP Secrets), dotenv for distribution |
| **Module System** | ES Modules | Modern, matches v1 |

## Success Criteria

- [ ] `npm install` completes without errors
- [ ] Basic LangChain/Anthropic connection test passes
- [ ] Project structure created with all directories
- [ ] Package.json configured for both dev and distribution
- [ ] vals secrets integration working

## Implementation Milestones

### Milestone 0: Research (Required First)
- [ ] Research current LangGraph/LangChain package versions and compatibility
- [ ] Check @langchain/anthropic setup patterns and configuration
- [ ] Review Node.js ES modules best practices for 2026
- [ ] Research vals secrets management patterns
- [ ] Document findings in `docs/research/prd-1-project-setup.md`

**Output**: Research document with current package versions, setup patterns, and recommendations

---

### Milestone 1: Initialize Project
**Pre-requisite**: Read `docs/research/prd-1-project-setup.md` before starting
- [ ] Create package.json with ES modules configuration
- [ ] Add core dependencies (langchain, langgraph, anthropic)
- [ ] Add dev dependencies (dotenv)
- [ ] Configure engines (Node 18+)

### Milestone 2: Create Directory Structure
- [ ] `src/` - Source code root
- [ ] `src/collectors/` - Git and Claude collectors
- [ ] `src/integrators/` - Context integration
- [ ] `src/generators/` - AI generation (LangGraph)
- [ ] `src/managers/` - Journal file management
- [ ] `src/mcp/` - MCP server and tools
- [ ] `src/utils/` - Shared utilities
- [ ] `scripts/` - Hook installation scripts
- [ ] `journal/` - Output directory (gitignored)

### Milestone 3: Configuration Setup
- [ ] Create `.env.example` with required variables
- [ ] Verify vals integration with `ANTHROPIC_API_KEY`
- [ ] Create basic config loader utility

### Milestone 4: Verify AI Connection
- [ ] Create simple test script that calls Claude Haiku
- [ ] Verify LangChain abstraction works
- [ ] Document model configuration

## Package.json Structure

```json
{
  "name": "commit-story",
  "version": "2.0.0",
  "description": "AI-powered engineering journal triggered by git commits",
  "type": "module",
  "main": "src/index.js",
  "bin": {
    "commit-story": "src/index.js",
    "commit-story-init": "scripts/install-hook.sh"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "@langchain/anthropic": "^0.3.x",
    "@langchain/core": "^0.3.x",
    "@langchain/langgraph": "^0.2.x",
    "dotenv": "^16.x"
  }
}
```

## Design Decisions

### DD-001: Claude Haiku as Default Model
**Decision**: Use `claude-3-5-haiku-latest` for all journal generation
**Rationale**:
- Cost-effective (~$0.25/1M tokens) - runs on every commit
- Fast - minimal latency impact
- Capable - summarization doesn't need heavy reasoning
- Thematic - Claude journaling Claude Code conversations

### DD-002: LangGraph for Orchestration
**Decision**: Use LangGraph StateGraph instead of manual async orchestration
**Rationale**:
- Declarative flow visible to instrumentation agent
- Built-in retry and streaming support
- Clean node boundaries for telemetry
- Same pattern as cluster-whisperer

### DD-003: Zero Telemetry by Design
**Decision**: No OpenTelemetry in Phase 1 code
**Rationale**:
- This is the "before" state for the KubeCon demo
- Instrumentation agent adds telemetry in Phase 3
- Keeps code clean and readable for demonstration

## Notes

- This PRD establishes the foundation; all other PRDs depend on it
- Keep dependencies minimal - only what's needed for core functionality
- Remember: zero telemetry is intentional, not an oversight
