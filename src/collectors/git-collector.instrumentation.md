# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 4.1K

## Schema Extensions
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers — skipped per RST-004. Their git I/O executions become child activity under the exported orchestrator spans through context propagation.
- getCommitData captures the merged result object into a const before returning, enabling setAttribute calls on result.author, result.subject, and result.timestamp without modifying non-instrumentation logic.
- result.timestamp is a Date object; converted via .toISOString() before setAttribute to satisfy attribute type safety (CDQ-007 — no raw objects).
- commit_story.commit.message is defined in schema as 'The first line of the commit message'. result.subject (the git commit subject line) is used rather than result.message (which includes body) to match that definition precisely.
- span.commit_story.git.get_commit_data and span.commit_story.git.get_previous_commit_time are new schema extensions — no existing span definitions in the registry cover these git data retrieval operations.

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
