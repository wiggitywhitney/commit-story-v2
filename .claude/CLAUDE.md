# Commit Story v2

A complete rebuild of commit-story using modern tooling (LangGraph) with zero telemetry. An AI instrumentation agent will add telemetry later.

## What This Project Does

An automated engineering journal triggered by git commits. It:
1. Triggers on git post-commit hook
2. Collects git diff and commit data
3. Collects Claude Code chat history (from `~/.claude/projects/`)
4. Uses AI to generate journal sections (summary, dialogue, technical decisions)
5. Writes markdown journal entries to `journal/entries/YYYY-MM/YYYY-MM-DD.md`
6. Optionally provides MCP tools for real-time context capture

## Tech Stack

- **LangGraph** (`@langchain/langgraph` v1.1.0) for AI orchestration
- **LangChain** for model integrations
- **Node.js** with ES modules
- **No telemetry** - this will be added by an instrumentation agent later

## Context

This is a rebuild of the original commit-story for Whitney's KubeCon EU 2026 talk "When the Codebase Starts Instrumenting Itself." The talk demonstrates an AI agent that auto-instruments code with OpenTelemetry.

The demo flow:
1. This app exists with zero instrumentation
2. A Weaver schema defines the telemetry conventions
3. An AI agent reads the schema and instruments this codebase
4. Telemetry flows to Datadog, validating the agent's work

## Architecture Reference

See the architecture report for the original commit-story:
`/Users/whitney.lee/Documents/Journal/misc notes/commit-story-architecture-report.md`

Key data flow:
```
Git Hook → Collectors (git, claude) → Context Integration → Filtering → AI Generation → Journal Save
```

## What Success Looks Like

- Git hook triggers journal generation
- Collects git diff and commit message
- Collects and filters Claude Code chat history
- Generates at least a summary section via AI
- Writes to journal file
- Clean, readable code that an instrumentation agent can work with
