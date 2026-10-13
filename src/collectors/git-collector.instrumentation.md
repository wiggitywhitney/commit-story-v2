# Instrumentation Report: src/collectors/git-collector.js

## Summary
- **Status**: success
- **Spans added**: 2
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 19.9K
- **Output tokens**: 19.3K
- **Cached tokens**: 91.9K

## Schema Extensions
- `span.commit_story.git.get_previous_commit_time`
- `commit_story.git.has_previous_commit`
- `span.commit_story.git.get_commit_data`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getPreviousCommitTime | instrumented | 1 |
| getCommitData | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 8 blocking errors (SCH-002 (Attribute Keys Match Registry):6, NDS-003 (Code Preserved):2)
2. **Attempt 2**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
3. **Attempt 3**: 1 blocking error (NDS-003 (Code Preserved):1)
4. **Attempt 4**: function-level: 2/2 functions instrumented

## Notes
- Function-level fallback: 2/2 functions instrumented
-   instrumented: getPreviousCommitTime (1 spans)
-   instrumented: getCommitData (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):23: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):51: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):89: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):114: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
