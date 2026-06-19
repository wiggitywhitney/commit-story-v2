# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: partial
- **Spans added**: 7
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 82.0K
- **Output tokens**: 78.6K
- **Cached tokens**: 335.7K

## Schema Extensions
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.monthly_summary_pipeline`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| readDayEntries | instrumented | 1 |
| formatDailySummary | instrumented | 0 |
| saveDailySummary | instrumented | 1 |
| generateAndSaveDailySummary | instrumented | 1 |
| getWeekBoundaries | instrumented | 0 |
| readWeekDailySummaries | skipped — Validation failed: COV-003 — COV-003 check failed: catch block at line 34 does not record error on span. Add span.recordException(error) and span.setStatus({ code: SpanStatusCode.ERROR }) in catch blocks to ensure errors are visible in traces. | 0 |
| formatWeeklySummary | instrumented | 0 |
| saveWeeklySummary | instrumented | 1 |
| generateAndSaveWeeklySummary | instrumented | 1 |
| getMonthBoundaries | instrumented | 0 |
| readMonthWeeklySummaries | skipped — Validation failed: COV-003, COV-003 — COV-003 check failed: catch block at line 26 does not record error on span. Add span.recordException(error) and span.setStatus({ code: SpanStatusCode.ERROR }) in catch blocks to ensure errors are visible in traces. | 0 |
| formatMonthlySummary | instrumented | 0 |
| saveMonthlySummary | instrumented | 1 |
| generateAndSaveMonthlySummary | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 4 blocking errors (COV-003 (Error Recording):4)
2. **Attempt 2**: 4 blocking errors (NDS-003 (Code Preserved):4)
3. **Attempt 3**: function-level: 12/14 functions instrumented

## Notes
- Function-level fallback: 12/14 functions instrumented
-   instrumented: readDayEntries (1 spans)
-   instrumented: formatDailySummary (0 spans)
-   instrumented: saveDailySummary (1 spans)
-   instrumented: generateAndSaveDailySummary (1 spans)
-   instrumented: getWeekBoundaries (0 spans)
-   instrumented: formatWeeklySummary (0 spans)
-   instrumented: saveWeeklySummary (1 spans)
-   instrumented: generateAndSaveWeeklySummary (1 spans)
-   instrumented: getMonthBoundaries (0 spans)
-   instrumented: formatMonthlySummary (0 spans)
-   instrumented: saveMonthlySummary (1 spans)
-   instrumented: generateAndSaveMonthlySummary (1 spans)
-   skipped: readWeekDailySummaries — Validation failed: COV-003 — COV-003 check failed: catch block at line 34 does not record error on span. Add span.recordException(error) and span.setStatus({ code: SpanStatusCode.ERROR }) in catch blocks to ensure errors are visible in traces.
-   skipped: readMonthWeeklySummaries — Validation failed: COV-003, COV-003 — COV-003 check failed: catch block at line 26 does not record error on span. Add span.recordException(error) and span.setStatus({ code: SpanStatusCode.ERROR }) in catch blocks to ensure errors are visible in traces.

## Advisory Findings
- COV-004 (Async Operation Spans):285: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):514: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-006 (isRecording Guard):37: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-006 (isRecording Guard):131: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):43: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):130: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):197: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):220: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):362: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):429: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):455: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):627: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):705: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):709: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
