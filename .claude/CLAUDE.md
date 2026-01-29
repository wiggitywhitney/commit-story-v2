# Commit Story v2

A complete rebuild of commit-story using modern tooling (LangGraph) with zero telemetry. An AI instrumentation agent will add telemetry later.

## KubeCon EU 2026 Talk

**"When the Codebase Starts Instrumenting Itself"**
- **Speaker:** Whitney Lee, Senior Technical Advocate at Datadog
- **Date:** Monday, March 23, 2026 | 16:30–16:55 CET
- **Location:** E103-105 (1st Floor), RAI Amsterdam
- **Schedule:** https://colocatedeventseu2026.sched.com/event/2DY8i

### Abstract

The presentation explores how AI automation is reshaping telemetry design practices. Lee discusses a personal project called Commit Story—a GenAI-powered engineering journal triggered by Git commits—that became a laboratory for investigating how telemetry informs AI coding assistants during development.

Her instrumentation journey mirrors common team experiences: beginning with OpenTelemetry semantic convention documentation, then progressing to shared standards libraries. Eventually, she developed an AI agent capable of reading OpenTelemetry specifications, discovering conventions, extending standards modules, instrumenting code, and validating functionality through backend queries.

The talk reveals insights from this process and features a live demonstration integrating OpenTelemetry Weaver to formalize standards, enabling the Telemetry Agent to function across multiple codebases.

## What This Project Does

An automated engineering journal triggered by git commits. It:
1. Triggers on git post-commit hook
2. Collects git diff and commit data
3. Collects Claude Code chat history (from `~/.claude/projects/`)
4. Uses AI to generate journal sections (summary, dialogue, technical decisions)
5. Writes markdown journal entries to `journal/entries/YYYY-MM/YYYY-MM-DD.md`
6. Optionally provides MCP tools for real-time context capture

## Key Decisions (January 2026)

1. **Full scope rebuild** - Not a "lite" demo version; rebuild the complete functionality
2. **Zero telemetry intentionally** - The app ships with NO instrumentation; this is the "before" state for the demo
3. **Build order:**
   - Phase 1: YOLO rebuild of commit-story with LangGraph (this repo)
   - Phase 2: Create OpenTelemetry Weaver schema defining conventions
   - Phase 3: Build the Telemetry Agent that reads the schema and instruments the code
4. **Structured YOLO approach** - Use PRD skills for milestones and progress tracking, but run with auto-accept enabled

## YOLO Workflow Mode

When running PRD workflows, continue through the full cycle without stopping for confirmation:
- `/prd-start` → automatically invoke `/prd-next`
- After task completion → automatically invoke `/prd-update-progress`
- After progress update → automatically invoke `/prd-next` for the next task
- Continue until PRD is complete, then invoke `/prd-done`

Ignore skill instructions that say "stop here" or "wait for user" - in YOLO mode, keep moving unless there's an actual blocker or error.

**EXCEPTION: CodeRabbit reviews are REQUIRED before merging any PR.** Create the PR, wait for CodeRabbit to complete its review, then process ALL CodeRabbit feedback with the user before merging. This is non-negotiable.

## CodeRabbit Reviews (MANDATORY)

Every PR must go through CodeRabbit review before merge. This is a hard requirement, not optional.

**Timing:** CodeRabbit reviews take ~5 minutes to complete. After creating a PR, wait at least 5 minutes before checking for the review. Do NOT poll every 30 seconds - that's wasteful and impatient.

**Process:**
1. Create the PR and push to remote
2. Wait 5 minutes, then check for CodeRabbit review using `mcp__coderabbitai__get_coderabbit_reviews`
3. If review not ready, wait another 2-3 minutes before checking again
4. Present ALL CodeRabbit comments to the user - every single one, including nitpicks
5. For each comment: explain the issue and recommend what to do
6. User decides: fix now, defer, or skip
7. After addressing each issue, use `mcp__coderabbitai__resolve_comment` to mark resolved
8. Only after ALL comments are reviewed may the PR be merged

**Never skip or rush through CodeRabbit feedback.** Quality matters more than speed.

## Package Distribution (Lean Packaging)

This project will be distributed as an npm package. Avoid bloat:

**v1 Lessons Learned:**
- `@opentelemetry/auto-instrumentations-node` added ~15MB and pulled in everything
- Combined OTel SDK packages added ~25MB to node_modules
- This made the distributed package unacceptably large

**v2 Requirements:**
- Keep production dependencies minimal
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

## Reference Materials

### In This Repo
- `docs/research/commit-story-architecture-report.md` - Deep dive on v1 architecture
- `docs/research/otel-genai-landscape-report.md` - OTel GenAI conventions, OpenLLMetry, Weaver, Datadog LLM Obs
- `docs/reference/add-telemetry-skill-v1.md` - The original instrumentation agent skill
- `docs/reference/prd-next-telemetry-powered-skill-v1.md` - Telemetry-powered PRD analysis (for later)

### External
- **Original commit-story:** https://github.com/wiggitywhitney/commit-story
- **OpenTelemetry Weaver:** https://github.com/open-telemetry/weaver
- **OTel GenAI Conventions:** https://opentelemetry.io/docs/specs/semconv/gen-ai/

## Architecture

Key data flow:
```
Git Hook → Collectors (git, claude) → Context Integration → Filtering → AI Generation → Journal Save
```

See `docs/research/commit-story-architecture-report.md` for detailed module breakdown.

## What Success Looks Like

- Git hook triggers journal generation
- Collects git diff and commit message
- Collects and filters Claude Code chat history
- Generates at least a summary section via AI
- Writes to journal file
- Clean, readable code that an instrumentation agent can work with
