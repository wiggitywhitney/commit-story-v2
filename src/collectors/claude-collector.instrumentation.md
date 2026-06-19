# Instrumentation Report: src/collectors/claude-collector.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.5K
- **Output tokens**: 8.1K
- **Cached tokens**: 21.8K

## Schema Extensions
- `span.commit_story.context.collect_messages`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getClaudeProjectsDir is a pure synchronous one-liner with no I/O — skipped (RST-001: no spans on synchronous utilities, RST-002: trivial accessor).
- encodeProjectPath is a pure synchronous string transformation with no I/O — skipped (RST-001).
- getClaudeProjectPath is a synchronous function using only existsSync from Node fs which is synchronous blocking I/O, but it is not async and is a direct helper called within the instrumented collectChatMessages parent span — skipped (RST-004: unexported-style helper covered by orchestrator span; RST-001: synchronous function).
- findJSONLFiles is a synchronous function using readdirSync and statSync — no async I/O — skipped (RST-001).
- parseJSONLFile is a synchronous function using readFileSync — no async I/O — skipped (RST-001). The inner catch block swallows malformed JSON lines without rethrowing — correctly left without error recording (NDS-007: graceful degradation catch).
- filterMessages is a pure synchronous data transformation — skipped (RST-001).
- groupBySession is a pure synchronous data transformation — skipped (RST-001).
- collectChatMessages is the exported async entry point (COV-001). Input time-window attributes are set unconditionally before the early-return guard on !projectPath, so both execution paths carry context. The span name 'commit_story.context.collect_messages' is new — declared in schemaExtensions. All attributes used are registered keys from the schema (commit_story.context.source, commit_story.context.time_window_start, commit_story.context.time_window_end, commit_story.context.sessions_count, commit_story.context.messages_count).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):230: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):231: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
