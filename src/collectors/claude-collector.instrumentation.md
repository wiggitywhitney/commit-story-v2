# Instrumentation Report: src/collectors/claude-collector.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 14.6K
- **Output tokens**: 14.9K
- **Cached tokens**: 19.8K

## Schema Extensions
- `span.commit_story.context.collect_chat_messages`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getClaudeProjectPath | instrumented | 0 |
| findJSONLFiles | instrumented | 0 |
| parseJSONLFile | instrumented | 0 |
| groupBySession | instrumented | 0 |
| collectChatMessages | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 6 blocking errors (NDS-003 (Code Preserved):6)
3. **Attempt 3**: 6 blocking errors (NDS-003 (Code Preserved):6)
4. **Attempt 4**: function-level: 5/5 functions instrumented

## Notes
- collectChatMessages is the sole exported async function and the COV-001 entry point — it gets a span (span.commit_story.context.collect_chat_messages). No matching span name exists in the schema, so this is reported as a schema extension.
- getClaudeProjectsDir, encodeProjectPath, getClaudeProjectPath, findJSONLFiles, parseJSONLFile, filterMessages, and groupBySession are all synchronous functions with no async I/O — skipped per RST-001 (no spans on synchronous utilities).
- All attributes set on the collectChatMessages span use registered keys: commit_story.context.source, commit_story.context.time_window_start, commit_story.context.time_window_end, commit_story.context.sessions_count, and commit_story.context.messages_count. No new attribute keys were invented.
- The early-return path (when no projectPath is found) also receives sessions_count=0 and messages_count=0 to ensure the span always carries diagnostic context regardless of the code path taken.
- Function-level fallback: 5/5 functions instrumented
-   instrumented: getClaudeProjectPath (0 spans)
-   instrumented: findJSONLFiles (0 spans)
-   instrumented: parseJSONLFile (0 spans)
-   instrumented: groupBySession (0 spans)
-   instrumented: collectChatMessages (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):253: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):257: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
