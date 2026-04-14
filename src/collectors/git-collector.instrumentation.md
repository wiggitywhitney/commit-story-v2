# Instrumentation Report: src/collectors/git-collector.js

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
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers — skipped per RST-004. Their I/O (execFileAsync/git calls) becomes observable as child activity under the exported orchestrator spans.
- commit_story.commit.author was not set despite being a registered schema attribute because CDQ-007 prohibits PII fields including 'author' and 'name'. The author name and authorEmail fields contain personal data. commit_story.commit.message is set to metadata.subject (the first line) rather than the full message body to bound attribute size and avoid capturing potentially sensitive commit body content.
- Two new span names were invented (commit_story.git.get_previous_commit_time, commit_story.git.get_commit_data) because the only schema-defined span (commit_story.context.collect_chat_messages) covers a different operation entirely. Both extensions follow the namespace.category.operation pattern required by the schema.
- metadata.timestamp is a Date object — converted to ISO string via .toISOString() before setAttribute per CDQ-007 (objects must not be passed directly as attribute values).

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
