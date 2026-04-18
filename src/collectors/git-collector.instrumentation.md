# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 4.1K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Skipped runGit, getCommitMetadata, getCommitDiff, and getMergeInfo per RST-004 — all are unexported. Their I/O (execFileAsync child process calls) becomes child activity within the exported orchestrator spans via context propagation.
- For commit_story.commit.message in getCommitData, result.subject (the first line) was used rather than result.message (the full body-inclusive string) because the schema attribute is defined as 'The first line of the commit message'.
- The timestamp Date object is converted to ISO 8601 string via .toISOString() before setAttribute to satisfy CDQ-007 type safety — OTel attributes must be primitives, not Date objects.
- In getPreviousCommitTime, the return value is captured in a const before returning so the ISO timestamp can be set as an attribute. The null early-return path before that code means the setAttribute is only reached when a valid Date exists — no undefined guard needed.

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
