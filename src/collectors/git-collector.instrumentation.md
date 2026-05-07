# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 1.7K
- **Output tokens**: 6.1K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers — skipping spans on them per RST-004 (unexported functions should not be instrumented when an exported orchestrator covers their execution path). getPreviousCommitTime and getCommitData are the exported orchestrators that provide span context for all child operations.
- In getCommitData, metadata.subject and metadata.timestamp are used directly before the return spread — this avoids the need for return-value capture and keeps the original return expression unchanged. metadata.timestamp is a Date object so .toISOString() is applied before setAttribute.
- The pre-instrumentation analysis listed all async functions as span candidates, but RST-004 takes precedence over COV-004 for unexported helpers when an exported orchestrator already covers the execution path.
- commit_story.commit.author is a registered schema attribute but CDQ-007 lists 'author' as a PII field name to avoid — omitted from span attributes in both getPreviousCommitTime and getCommitData to prevent PII leakage in telemetry.
- span.commit_story.git.get_previous_commit_time and span.commit_story.git.get_commit_data are new schema extensions — no existing span in the registry covers git data retrieval operations. The namespace prefix commit_story matches the project registry, and the git category accurately describes the domain.

## Advisory Findings
- COV-004 (Async Operation Spans):22: "runGit" (async function) at line 22 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):47: "getCommitMetadata" (async function) at line 47 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):80: "getCommitDiff" (async function) at line 80 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):105: "getMergeInfo" (async function) at line 105 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- CDQ-007 (Attribute Data Quality):158: CDQ-007: setAttribute value "metadata.subject" at line 158 accesses a property of "metadata" without a null/undefined guard. If "metadata" can be null or undefined, this will throw at runtime. Add an `if (metadata)` check or use optional chaining (`metadata?.subject`).
