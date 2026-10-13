# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 63.7K
- **Output tokens**: 60.1K
- **Cached tokens**: 268.1K

## Schema Extensions
- `span.commit_story.journal.read_day_entries`
- `commit_story.journal.entries_count`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.generate_and_save_daily_summary`
- `commit_story.journal.force`
- `span.commit_story.journal.read_week_daily_summaries`
- `commit_story.journal.week`
- `commit_story.journal.daily_summaries_count`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.read_month_weekly_summaries`
- `commit_story.journal.month`
- `commit_story.journal.weekly_summaries_count`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.generate_and_save_monthly_summary`

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
1. **Attempt 1**: 5 blocking errors (SCH-002 (Attribute Keys Match Registry):3, NDS-005 (Control Flow Preserved):1, NDS-007 (Expected Catch Unmodified):1)
2. **Attempt 2**: 11 blocking errors (SCH-002 (Attribute Keys Match Registry):11)
3. **Attempt 3**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):2, NDS-005 (Control Flow Preserved):1, NDS-007 (Expected Catch Unmodified):1)
4. **Attempt 4**: function-level: 14/14 functions instrumented

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
- CDQ-007 (Attribute Data Quality):89: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):222: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):360: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):493: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):647: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):721: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):785: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
