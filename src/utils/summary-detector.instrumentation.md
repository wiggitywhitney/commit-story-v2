# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 70.9K
- **Output tokens**: 70.5K
- **Cached tokens**: 83.3K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `commit_story.journal.base_path`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_weeks`
- `commit_story.journal.unsummarized_weeks_count`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.journal.unsummarized_months_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| getDaysWithEntries | instrumented | 1 |
| findUnsummarizedDays | instrumented | 1 |
| getDaysWithDailySummaries | instrumented | 1 |
| findUnsummarizedWeeks | instrumented | 1 |
| findUnsummarizedMonths | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 12 blocking errors (NDS-003 (Code Preserved):6, SCH-002 (Attribute Keys Match Registry):6)
2. **Attempt 2**: 12 blocking errors (SCH-002 (Attribute Keys Match Registry):12)
3. **Attempt 3**: 7 blocking errors (SCH-002 (Attribute Keys Match Registry):7)
4. **Attempt 4**: function-level: 5/5 functions instrumented

## Notes
- Function-level fallback: 5/5 functions instrumented
-   instrumented: getDaysWithEntries (1 spans)
-   instrumented: findUnsummarizedDays (1 spans)
-   instrumented: getDaysWithDailySummaries (1 spans)
-   instrumented: findUnsummarizedWeeks (1 spans)
-   instrumented: findUnsummarizedMonths (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):115: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):181: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):306: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):331: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality):64: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):97: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):147: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):163: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):210: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):230: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):255: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):364: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
