# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.5K
- **Output tokens**: 4.3K

## Schema Extensions
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers — they are not instrumented directly because the exported orchestrators (getCommitData, getPreviousCommitTime) already cover their execution paths via context propagation (RST-004: do not add spans to unexported internal functions when an exported orchestrator's span covers that path).
- The commit_story.commit.author registered attribute was intentionally omitted from all spans — CDQ-007 prohibits setting PII fields, and 'author' is explicitly listed as a PII attribute name to avoid.
- commit_story.commit.message was set to metadata.subject (the %s format specifier, first line of commit message) rather than metadata.message (full multi-line message) because the schema definition states 'The first line of the commit message', and setting the full body could include unbounded content that violates CDQ-007's guidance on unbounded attributes.
- Two new span names were invented: span.commit_story.git.get_commit_data and span.commit_story.git.get_previous_commit_time. No matching entries exist in the schema's span groups — the only schema-defined span is commit_story.context.collect_chat_messages, which belongs to a different domain (chat message collection, not git data retrieval).

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
