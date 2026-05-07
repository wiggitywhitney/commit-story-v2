# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.2K
- **Output tokens**: 6.4K
- **Cached tokens**: 19.7K

## Schema Extensions
- `span.commit_story.context.gather_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- gatherContextForCommit is the primary service entry point — it orchestrates git data collection, chat message collection, filtering, token budgeting, and sensitive-data redaction. The new span name commit_story.context.gather_context was invented because no existing schema span covers this top-level orchestrator role (the existing span.commit_story.context.collect_chat_messages is already used by the claude-collector file and describes a narrower sub-operation).
- formatContextForPrompt is a synchronous pure data transformation that converts an already-built context object into a string — no I/O, no async, no network/disk access. It was skipped (RST-001: no spans on synchronous utilities without I/O).
- getContextSummary is a synchronous accessor that extracts a subset of fields from the context object — single-purpose, no I/O. It was skipped (RST-001).
- All seven attributes set on the gather_context span (vcs.ref.head.revision, commit_story.context.time_window_start/end, commit_story.context.messages_count/sessions_count, commit_story.filter.messages_before/after) are registered in the Weaver schema — attributesCreated is 0. CDQ-007 PII fields (author, authorEmail) were deliberately excluded from span attributes.
