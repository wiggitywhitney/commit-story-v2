# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 20.4K
- **Output tokens**: 27.3K
- **Cached tokens**: 40.2K

## Schema Extensions
- `span.commit_story.context.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |
| getCommitData | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 5 blocking errors (NDS-003 (Code Preserved):5)
2. **Attempt 2**: 5 blocking errors (NDS-003 (Code Preserved):5)
3. **Attempt 3**: 7 blocking errors (NDS-003 (Code Preserved):5, SCH-002 (Attribute Keys Match Registry):2)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- runGit is an unexported async function that makes an external execFile call (shell out to git). Per COV-004 and COV-002, it receives a span for the external process invocation. The existing try/catch that transforms git error codes is preserved intact as the inner try/catch; OTel error recording is added before the rethrow paths so the span captures the error before any transformation.
- getCommitMetadata: commit_story.commit.author (the author name) and authorEmail were not set as attributes because 'author' and 'email' are listed as PII fields in CDQ-007. The commit subject/message is guarded with span.isRecording() per CDQ-006 because it involves a template-literal concatenation (non-trivial string construction). The timestamp is set using new Date(timestampStr).toISOString() to guarantee a string value.
- commit_story.git.command — no registered attribute captures the git subcommand (first element of the args array). The closest registered key is vcs.ref.head.revision which captures a ref, not a command verb. A new key is needed to identify which git operation is running.
- commit_story.git.is_merge — no registered attribute captures whether a commit is a merge commit. The registered boolean/numeric attributes are all counts or timestamps. A new boolean attribute is needed.
- commit_story.git.parent_count — no registered attribute captures the number of parent commits. The registered count attributes (messages_count, sessions_count, files_changed) all describe different domains. A new int attribute is needed.
- getCommitDiff returns raw diff text which can be very large and would violate CDQ-007 (unbounded attributes). Only the input commitRef is set as an attribute. The diff length could be set but no registered key exists for it and adding a schema extension just for length was deemed low value.
- Lines 164–166 in the output are blank trailing lines matching the original file ending.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)
-   instrumented: getCommitData (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):51: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):89: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):114: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
