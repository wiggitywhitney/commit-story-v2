# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 21.7K
- **Output tokens**: 32.9K
- **Cached tokens**: 40.2K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |
| getCommitData | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 19 blocking errors (NDS-003 (Code Preserved):14, NDS-005 (Control Flow Preserved):2, SCH-002 (Attribute Keys Match Registry):2, COV-003 (Error Recording):1)
2. **Attempt 2**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
3. **Attempt 3**: 20 blocking errors (NDS-003 (Code Preserved):14, SCH-001 (Span Names Match Registry):6)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- commit_story.git.subcommand (new extension): set in runGit to capture which git subcommand (e.g., 'show', 'log', 'diff-tree', 'rev-list') is being executed. No registered key covers 'the git subcommand being invoked' — vcs.ref.head.revision describes a commit reference, not a command name. This attribute is always present (args[0] is always defined) so COV-005 is satisfied even when commitRef is not supplied.
- commit_story.git.parent_count (new extension): set in getMergeInfo to capture the integer number of parent commits. No registered key covers 'count of parent commits in a git commit' — commit_story.commit.files_changed counts files, not parents, and is a different concept entirely. Type is int per schema convention for count attributes.
- runGit is an unexported helper but is instrumented per the deterministic pre-analysis finding (COV-004). All six functions in the file are spanned; the 20% ratio backstop threshold is exceeded, but the pre-analysis explicitly required all six functions, so all are instrumented.
- getCommitMetadata sets commit_story.commit.author, commit_story.commit.message, and commit_story.commit.timestamp using variables already in scope before the return statement — no return-value capture was needed since the variables are local to the function body.
- CDQ-007: authorEmail is available in getCommitMetadata but intentionally not set as a span attribute because email addresses are PII. Only author name is set via the registered commit_story.commit.author key.
- getCommitData sets commit_story.commit.author and commit_story.commit.message from metadata.author and metadata.subject after the Promise.all resolves, before the spread return — these are the most useful identifiers for debugging and are registered keys.
- Function-level fallback: 2/2 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)
-   instrumented: getCommitData (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):51: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):89: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):114: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
