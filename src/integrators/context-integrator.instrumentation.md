# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 17.6K
- **Output tokens**: 19.6K
- **Cached tokens**: 22.0K

## Schema Extensions
- `span.commit_story.context.gather_context_for_commit`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| gatherContextForCommit | instrumented | 1 |
| formatContextForPrompt | instrumented | 0 |

## Validation Journey
1. **Attempt 1**: 7 blocking errors (NDS-003 (Code Preserved):7)
2. **Attempt 2**: 7 blocking errors (NDS-003 (Code Preserved):7)
3. **Attempt 3**: 7 blocking errors (NDS-003 (Code Preserved):7)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- gatherContextForCommit is the exported async orchestrator for all context collection — it receives a span as a COV-001 entry point. The schema has no pre-defined span matching this function, so the new name commit_story.context.gather_context_for_commit is declared as a schema extension following the existing namespace pattern.
- formatContextForPrompt is a pure synchronous function that builds a formatted string from an already-constructed context object — no I/O, no async operations. Skipped per RST-001 (no spans on synchronous utilities).
- getContextSummary is a pure synchronous function that projects fields from a context object into a summary shape — no I/O, no async operations. Skipped per RST-001 (no spans on synchronous utilities).
- Callee functions getCommitData, getPreviousCommitTime, and collectChatMessages are already instrumented in their respective collector files and own their own spans. No duplicate spans added for those calls per the pre-instrumentation analysis.
- Used commit_story.filter.messages_before (filterStats.total = total messages before filtering) and commit_story.filter.messages_after (filteredMessages.length = messages after filtering) — these are the registered filter count keys and match semantically.
- Used commit_story.context.sessions_count (filteredSessions.size) and commit_story.context.messages_count (filteredMessages.length) — these registered keys describe sessions found and messages collected, which matches the post-filter values available at this point in the function.
- Used vcs.ref.head.revision for the commitRef parameter — this registered key captures the commit reference (hash, branch name, or symbolic ref such as HEAD) that identifies which commit is being processed.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: gatherContextForCommit (1 spans)
-   instrumented: formatContextForPrompt (0 spans)

## Advisory Findings
- CDQ-006 (isRecording Guard):110: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):52: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):88: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):92: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):96: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):100: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
