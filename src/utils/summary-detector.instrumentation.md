# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: partial
- **Spans added**: 4
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 70.8K
- **Output tokens**: 52.5K
- **Cached tokens**: 217.4K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.journal.base_path`
- `commit_story.journal.unsummarized_months_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getDaysWithEntries | instrumented | 1 |
| findUnsummarizedDays | instrumented | 1 |
| getDaysWithDailySummaries | instrumented | 1 |
| findUnsummarizedWeeks | skipped — Validation failed: SCH-002, SCH-002 — SCH-002 check failed: declared attribute extension "commit_story.journal.base_path" is a semantic duplicate of existing registry attribute "commit_story.journal.file_path". Use the existing registry attribute instead of declaring a new extension. | 0 |
| findUnsummarizedMonths | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 6 blocking errors (SCH-002 (Attribute Keys Match Registry):6)
2. **Attempt 2**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
3. **Attempt 3**: function-level: 4/5 functions instrumented

## Notes
- Function-level fallback: 4/5 functions instrumented
-   instrumented: getDaysWithEntries (1 spans)
-   instrumented: findUnsummarizedDays (1 spans)
-   instrumented: getDaysWithDailySummaries (1 spans)
-   instrumented: findUnsummarizedMonths (1 spans)
-   skipped: findUnsummarizedWeeks — Validation failed: SCH-002, SCH-002 — SCH-002 check failed: declared attribute extension "commit_story.journal.base_path" is a semantic duplicate of existing registry attribute "commit_story.journal.file_path". Use the existing registry attribute instead of declaring a new extension.

## Advisory Findings
- COV-004 (Async Operation Spans):118: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):194: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):264: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):301: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):326: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality):65: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):224: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):359: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):400: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
