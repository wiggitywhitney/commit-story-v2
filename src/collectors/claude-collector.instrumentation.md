# Instrumentation Report: src/collectors/claude-collector.js

## Summary
- **Status**: partial
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 14.3K
- **Output tokens**: 19.4K
- **Cached tokens**: 19.9K

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
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 2 blocking errors (NDS-003 (Code Preserved):2)
3. **Attempt 3**: 2 blocking errors (NDS-003 (Code Preserved):2)
4. **Attempt 4**: function-level: 5/5 functions instrumented
5. **Attempt 5**: reassembly: NDS-003: NDS-003: original line 228 missing/modified: allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));; NDS-003: NDS-003: non-instrumentation line added at instrumented line 247: allMessages.sort(

## Notes
- span.commit_story.context.collect_chat_messages is a new span name — no existing schema span matched this operation (collecting Claude Code chat messages for a commit). Registered under the commit_story namespace following the <namespace>.<category>.<operation> convention.
- getClaudeProjectsDir, encodeProjectPath, getClaudeProjectPath, findJSONLFiles, parseJSONLFile, filterMessages, and groupBySession are all pure synchronous functions with no async I/O — skipped per RST-001 (no spans on synchronous utilities).
- The catch block inside parseJSONLFile's for-loop is an expected-condition catch that swallows malformed JSON lines and continues processing — no error recording added there per NDS-007 (graceful-degradation catch, does not propagate the error).
- The early-return path (when projectPath is null) sets sessions_count=0 and messages_count=0 before returning so the span still carries diagnostic attributes in the no-project-found scenario.
- commit_story.context.source is set to 'claude_code' as a fixed attribute identifying this collector's data source, matching the registered enum value for that attribute.
- commit_story.context.time_window_start and commit_story.context.time_window_end are set from previousCommitTime and commitTime respectively by calling .toISOString() — these are Date objects passed as parameters, so .toISOString() is safe.
- Function-level fallback: 5/5 functions instrumented
-   instrumented: getClaudeProjectPath (0 spans)
-   instrumented: findJSONLFiles (0 spans)
-   instrumented: parseJSONLFile (0 spans)
-   instrumented: groupBySession (0 spans)
-   instrumented: collectChatMessages (1 spans)
- Reassembly validation failed — using partial results. Failing rules: NDS-003: NDS-003: original line 228 missing/modified: allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));; NDS-003: NDS-003: non-instrumentation line added at instrumented line 247: allMessages.sort(

## Advisory Findings
- CDQ-007 (Attribute Data Quality):253: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):254: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
