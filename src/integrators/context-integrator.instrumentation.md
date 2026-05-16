# Instrumentation Report: src/integrators/context-integrator.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 31.9K
- **Output tokens**: 31.8K
- **Cached tokens**: 20.9K

## Schema Extensions
- `span.commit_story.context.gather_for_commit`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| gatherContextForCommit | instrumented | 1 |
| formatContextForPrompt | instrumented | 0 |

## Validation Journey
1. **Attempt 1**: 23 blocking errors (NDS-003 (Code Preserved):23)
2. **Attempt 2**: 1 blocking error (NDS-003 (Code Preserved):1)
3. **Attempt 3**: 23 blocking errors (NDS-003 (Code Preserved):23)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- Added span 'commit_story.context.gather_context_for_commit' for gatherContextForCommit — this is the central orchestrator entry point (COV-001). No matching span existed in the schema registry, so it is declared as a schema extension.
- formatContextForPrompt is a pure synchronous function that builds a string from an existing context object — no I/O or async operations, so no span is added (RST-001: no spans on synchronous utilities).
- getContextSummary is a pure synchronous function that extracts summary fields from a context object — no I/O or async operations, so no span is added (RST-001: no spans on synchronous utilities).
- Sub-operations getCommitData, getPreviousCommitTime, and collectChatMessages are already instrumented in their respective collector files — no additional spans are added for those calls per the pre-instrumentation analysis.
- commit_story.commit.message is a registered schema attribute and is set on the span. The value comes from commitData.message which is a string field per the git collector contract.
- commit_story.context.messages_count and commit_story.context.sessions_count are registered schema attributes used to capture filteredMessages.length and filteredSessions.size respectively — these are the counts of messages and sessions after filtering, matching the registry definitions.
- commit_story.filter.messages_before is set to filterStats.total (raw message count before filtering) and commit_story.filter.messages_after is set to filterStats.preserved (messages retained after filtering) — these match the registry definitions for pre- and post-filter message counts.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: gatherContextForCommit (1 spans)
-   instrumented: formatContextForPrompt (0 spans)
