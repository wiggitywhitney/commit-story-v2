# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 20.7K
- **Output tokens**: 35.7K
- **Cached tokens**: 20.0K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |
| getCommitData | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 12 blocking errors (NDS-003 (Code Preserved):6, SCH-002 (Attribute Keys Match Registry):3, NDS-005 (Control Flow Preserved):2, COV-003 (Error Recording):1)
2. **Attempt 2**: 6 blocking errors (NDS-003 (Code Preserved):6)
3. **Attempt 3**: 6 blocking errors (NDS-003 (Code Preserved):6)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- commit_story.git.command captures the git subcommand (e.g., 'show', 'log', 'diff-tree') passed as args[0] to runGit. No registered attribute covers the concept of which git sub-command is being executed — vcs.ref.head.name is a branch name and vcs.ref.head.revision is a commit SHA, neither matches a git operation name.
- commit_story.git.parent_count captures the integer number of parent commits for a given commit ref. No registered attribute covers parent commit count — commit_story.commit.files_changed and other registered count attributes describe different data.
- commit_story.git.is_merge captures a boolean indicating whether the commit is a merge commit. No registered attribute covers merge status — all registered boolean-like concepts are counts or string enumerations.
- runGit is an unexported helper, but it is called by all six instrumented functions and performs the actual git I/O (child process execFile). The pre-instrumentation analysis explicitly requires a span here (COV-004). Its span provides visibility into the git subprocess boundary and error details.
- In getPreviousCommitTime, the return value for the non-null path is new Date(timestamps[1]) — a constructor expression. Per the return-value capture exception, constructors cannot be extracted to const. Instead, the already-available string timestamps[1] is used directly to set commit_story.commit.timestamp before the return, avoiding any modification to the return statement.
- In getCommitData, metadata.timestamp is a Date object created by getCommitMetadata. Calling .toISOString() is safe here because the Date constructor in getCommitMetadata always receives a timestampStr string from git output, producing a valid Date.
- commit_story.commit.author is a registered schema attribute (commit_story.commit.author) and is used as-is despite CDQ-007 noting 'author' as a PII-adjacent key — the schema explicitly registers this attribute for use, so it takes precedence over the advisory.
- All six spans cover both the two COV-001 exported entry points (getPreviousCommitTime, getCommitData) and the four COV-004 async I/O functions (runGit, getCommitMetadata, getCommitDiff, getMergeInfo).
- Function-level fallback: 2/2 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)
-   instrumented: getCommitData (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):51: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):89: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):114: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
