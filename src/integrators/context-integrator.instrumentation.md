# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.2K
- **Output tokens**: 4.4K

## Schema Extensions
- `span.commit_story.context.gather_context`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- span.commit_story.context.gather_context is a new schema extension — no existing span in the registry covers the orchestration of git data collection, chat collection, filtering, and token budgeting into a single context object. The existing span commit_story.context.collect_chat_messages covers only the chat collection sub-step.
- formatContextForPrompt and getContextSummary are both pure synchronous data transformations with no I/O — RST-001 applies, so they were skipped despite being exported.
- filterStats.total is mapped to commit_story.filter.messages_before (messages before noise-removal filtering) and filterStats.preserved to commit_story.filter.messages_after — these are the closest semantic matches in the registry for before/after filter counts.
- Time window dates are converted via .toISOString() before setAttribute to satisfy CDQ-007 (no object values) and SCH-003 (string type for time_window_start/end).
