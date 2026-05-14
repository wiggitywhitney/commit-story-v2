# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 3.8K

## Schema Extensions
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are unexported internal helpers — skipped per RST-004. Their I/O operations become child work within the exported orchestrator spans via context propagation.
- getCommitData sets commit_story.commit.message to metadata.subject (the commit subject line), which matches the schema definition of 'the first line of the commit message'.
- metadata.timestamp is a Date object — converted to ISO string via .toISOString() before setAttribute to satisfy CDQ-007 attribute type safety.
- The two new span names (commit_story.git.get_commit_data, commit_story.git.get_previous_commit_time) are schema extensions because no matching span was defined in the Weaver registry for git data collection operations.

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
