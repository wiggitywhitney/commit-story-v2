# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 64.8K
- **Output tokens**: 75.4K
- **Cached tokens**: 215.2K

## Schema Extensions
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.generate_and_save_daily_summary`
- `commit_story.journal.summary_saved`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.read_month_weekly_summaries`
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
| readWeekDailySummaries | instrumented | 1 |
| formatWeeklySummary | instrumented | 0 |
| saveWeeklySummary | instrumented | 1 |
| generateAndSaveWeeklySummary | instrumented | 1 |
| getMonthBoundaries | instrumented | 0 |
| readMonthWeeklySummaries | instrumented | 1 |
| formatMonthlySummary | instrumented | 0 |
| saveMonthlySummary | instrumented | 1 |
| generateAndSaveMonthlySummary | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 3 blocking errors (NDS-007 (Expected Catch Unmodified):2, NDS-005 (Control Flow Preserved):1)
2. **Attempt 2**: 1 blocking error (NDS-007 (Expected Catch Unmodified):1)
3. **Attempt 3**: function-level: 14/14 functions instrumented

## Notes
- Function-level fallback: 14/14 functions instrumented
-   instrumented: readDayEntries (1 spans)
-   instrumented: formatDailySummary (0 spans)
-   instrumented: saveDailySummary (1 spans)
-   instrumented: generateAndSaveDailySummary (1 spans)
-   instrumented: getWeekBoundaries (0 spans)
-   instrumented: readWeekDailySummaries (1 spans)
-   instrumented: formatWeeklySummary (0 spans)
-   instrumented: saveWeeklySummary (1 spans)
-   instrumented: generateAndSaveWeeklySummary (1 spans)
-   instrumented: getMonthBoundaries (0 spans)
-   instrumented: readMonthWeeklySummaries (1 spans)
-   instrumented: formatMonthlySummary (0 spans)
-   instrumented: saveMonthlySummary (1 spans)
-   instrumented: generateAndSaveMonthlySummary (1 spans)

## Advisory Findings
- COV-004 (Async Operation Spans):30: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality):151: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):213: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):239: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):334: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):400: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):457: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):600: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):739: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):774: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
