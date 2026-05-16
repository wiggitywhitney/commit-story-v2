# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 1
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 24.0K
- **Output tokens**: 29.6K
- **Cached tokens**: 19.6K

## Schema Extensions
- `span.commit_story.commit.get_previous_commit_time`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 20 blocking errors (NDS-003 (Code Preserved):14, SCH-002 (Attribute Keys Match Registry):6)
2. **Attempt 2**: 7 blocking errors (NDS-003 (Code Preserved):4, SCH-002 (Attribute Keys Match Registry):3)
3. **Attempt 3**: 14 blocking errors (NDS-003 (Code Preserved):14)
4. **Attempt 4**: function-level: 1/1 functions instrumented

## Notes
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are unexported helpers, but the pre-instrumentation analysis explicitly requires spans on all of them (COV-004) — they are instrumented as async I/O operations that benefit from individual tracing even as children of the exported orchestrators.
- commit_story.git.subcommand was added as a new schema extension on the runGit span — no existing registered key captures the git subcommand (e.g., 'show', 'diff-tree', 'log'). The closest registered key is vcs.ref.head.revision which identifies a commit reference, not the operation type.
- commit_story.commit.parent_count was added as a new schema extension on getMergeInfo — no registered attribute captures the number of parent commits. This is diagnostic for merge detection logic and complements the isMerge boolean that is computed from it.
- CDQ-007: commit_story.commit.author and commit_story.commit.message were intentionally omitted from getCommitMetadata even though these variables are available — author names and commit messages can contain PII and the advisory warns against setting author/name fields as span attributes.
- The existing try/catch in runGit always rethrows (either a reformatted Error or the original), so span.recordException and span.setStatus(ERROR) were added at the top of the catch block (COV-003). The code 128 branches are not graceful-degradation paths — they still throw.
- Function-level fallback: 1/1 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):51: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):89: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):114: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):161: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
