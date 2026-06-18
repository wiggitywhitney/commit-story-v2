# Instrumentation Report: src/collectors/claude-collector.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.5K
- **Output tokens**: 5.9K
- **Cached tokens**: 21.3K

## Schema Extensions
- `span.commit_story.context.collect_messages`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getClaudeProjectsDir, encodeProjectPath, getClaudeProjectPath, findJSONLFiles, parseJSONLFile, filterMessages, and groupBySession are all pure synchronous functions with no async I/O — they are skipped per RST-001 (no spans on synchronous utilities). Their execution is captured as part of the collectChatMessages span.
- collectChatMessages is the sole exported async entry point and receives a span per COV-001. The span name 'commit_story.context.collect_messages' is a new extension; no existing registry span covered this Claude Code chat collection operation.
- All five attributes set on the collectChatMessages span (commit_story.context.source, commit_story.context.time_window_start, commit_story.context.time_window_end, commit_story.context.sessions_count, commit_story.context.messages_count) are already registered in the schema — no new attribute keys were invented.
- Input parameter attributes (source, time_window_start, time_window_end) are set unconditionally before the early-return guard on projectPath, ensuring those attributes are present on the early-exit span path as well as the happy path.
- The catch block inside parseJSONLFile (which swallows malformed JSON without rethrowing) was left without error recording per NDS-007 — it is a graceful-degradation catch that represents expected control flow, not a failure condition.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):230: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):231: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
