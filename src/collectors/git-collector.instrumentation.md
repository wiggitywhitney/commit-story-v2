# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 2.1K
- **Output tokens**: 6.7K
- **Cached tokens**: 19.6K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 14 blocking errors (NDS-003 (Code Preserved):14)
2. **Attempt 2**: Anthropic API call failed: terminated
3. **Attempt 3**: function-level: 1/1 functions instrumented

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers. Although the pre-instrumentation analysis flagged them for COV-004, RST-004 takes precedence — when an exported orchestrator span covers an unexported function's execution path, the helper should not be independently instrumented. Both getPreviousCommitTime and getCommitData provide orchestrator spans, so all four helpers are skipped; their child_process invocations will appear as child spans under the orchestrator spans through context propagation.
- commit_story.commit.author (mapped to metadata.author) was intentionally omitted from getCommitData's span attributes. CDQ-007 lists 'author' as a PII field that should not be set as a span attribute.
- span.commit_story.git.get_previous_commit_time and span.commit_story.git.get_commit_data are new span names not present in the schema. They follow the commit_story namespace and git category convention consistent with the existing registry. Both are reported as schemaExtensions.
- For getCommitData, commit_story.commit.message is populated from metadata.subject (the first line of the commit message) rather than metadata.message (which includes the body). This matches the schema's documented example intent ('The first line of the commit message'). metadata.timestamp is a Date object and is coerced to an ISO 8601 string via toISOString() to satisfy the commit_story.commit.timestamp type constraint.
- Function-level fallback: 1/1 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: "runGit" (async function) at line 23 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):51: "getCommitMetadata" (async function) at line 51 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):89: "getCommitDiff" (async function) at line 89 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):114: "getMergeInfo" (async function) at line 114 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):165: "getCommitData" (async function) at line 165 is exported and async but has no span. Add a span wrapping this function's body. Context propagation is not a valid exemption for exported async functions. RST-004 (unexported function) does not apply here — this function is exported. RST-001 (utility function heuristic) applies only to unexported synchronous functions. If this function is a thin wrapper delegating to another already-instrumented function, RST-003 may apply.
