# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 15.9K
- **Output tokens**: 13.5K
- **Cached tokens**: 21.0K

## Schema Extensions
- `span.commit_story.context.gather_for_commit`

## Validation Journey
1. **Attempt 1**: 23 blocking errors (NDS-003 (Code Preserved):23)
2. **Attempt 2**: 0 errors

## Notes
- gatherContextForCommit is the exported async entry point and gets a span (COV-001). The span name 'commit_story.context.gather_for_commit' is new — 'commit_story.context.collect_messages' (SCH-001 advisory) belongs to the claude-collector layer and covers only chat message collection; this span covers the full orchestration of git data, chat data, filtering, token budgeting, and redaction, making them distinct operations.
- formatContextForPrompt and getContextSummary are exported but purely synchronous data transformations with no I/O — skipped (RST-001).
- CDQ-007 advisories addressed: filterStats, filteredMessages, and filteredSessions property accesses are now guarded with != null checks before the corresponding setAttribute calls.
- All setAttribute keys (vcs.ref.head.revision, commit_story.filter.messages_before, commit_story.filter.messages_after, commit_story.context.messages_count, commit_story.context.sessions_count, commit_story.context.time_window_start, commit_story.context.time_window_end) are registered in the schema — attributesCreated is 0.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
