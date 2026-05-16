# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: partial
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 92.2K
- **Output tokens**: 78.4K
- **Cached tokens**: 329.9K

## Schema Extensions
- `span.commit_story.journal.read_day_entries`
- `commit_story.journal.entries_count`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.save_monthly_summary`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| readDayEntries | instrumented | 1 |
| formatDailySummary | instrumented | 0 |
| saveDailySummary | instrumented | 1 |
| generateAndSaveDailySummary | skipped — Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×6) at NDS-003:13, NDS-003:14, NDS-003:15, NDS-003:16, NDS-003:17 | 0 |
| getWeekBoundaries | instrumented | 0 |
| readWeekDailySummaries | instrumented | 1 |
| formatWeeklySummary | instrumented | 0 |
| saveWeeklySummary | instrumented | 1 |
| generateAndSaveWeeklySummary | skipped — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 13 missing/modified: export async function generateAndSaveWeeklySummary(
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |
| getMonthBoundaries | instrumented | 0 |
| readMonthWeeklySummaries | instrumented | 1 |
| formatMonthlySummary | instrumented | 0 |
| saveMonthlySummary | instrumented | 1 |
| generateAndSaveMonthlySummary | skipped — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 13 missing/modified: export async function generateAndSaveMonthlySummary(
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |

## Validation Journey
1. **Attempt 1**: 55 blocking errors (NDS-003 (Code Preserved):55)
2. **Attempt 2**: 5 blocking errors (NDS-003 (Code Preserved):5)
3. **Attempt 3**: function-level: 11/14 functions instrumented

## Notes
- The five synchronous functions — formatDailySummary, getWeekBoundaries, formatWeeklySummary, getMonthBoundaries, formatMonthlySummary — are pure data transformations with no I/O and are skipped per RST-001.
- All nine schema-defined span names for this domain were already claimed by earlier files. New span names follow the same namespace/category pattern (commit_story.journal.*) but describe this file's distinct orchestration roles: read_day_entries, save_daily_summary, generate_and_save_daily_summary, etc.
- Invented commit_story.journal.entries_count for the count of raw journal entry strings split from a day file. The registry has commit_story.journal.daily_summaries_count (for daily summary files within a week), commit_story.journal.quotes_count (for extracted developer quotes), and commit_story.journal.reflections_count — none of these match 'raw journal entries read from a single day file'.
- Array variables (entries, summaries, dailySummaries, weeklySummaries) are always initialized to [] and never null, making the CDQ-007 null guards technically unnecessary. Guards (if (x != null)) were added anyway to satisfy the advisory.
- The commit_story.journal.file_path attribute is set to the raw filesystem path returned by getSummaryPath. CDQ-007 recommends using path.basename() or a project-relative path, but path.basename is not imported in this file and adding non-OTel imports is prohibited. Raw path values are used; this is a known limitation.
- Function-level fallback: 11/14 functions instrumented
-   instrumented: readDayEntries (1 spans)
-   instrumented: formatDailySummary (0 spans)
-   instrumented: saveDailySummary (1 spans)
-   instrumented: getWeekBoundaries (0 spans)
-   instrumented: readWeekDailySummaries (1 spans)
-   instrumented: formatWeeklySummary (0 spans)
-   instrumented: saveWeeklySummary (1 spans)
-   instrumented: getMonthBoundaries (0 spans)
-   instrumented: readMonthWeeklySummaries (1 spans)
-   instrumented: formatMonthlySummary (0 spans)
-   instrumented: saveMonthlySummary (1 spans)
-   skipped: generateAndSaveDailySummary — Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×6) at NDS-003:13, NDS-003:14, NDS-003:15, NDS-003:16, NDS-003:17
-   skipped: generateAndSaveWeeklySummary — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 13 missing/modified: export async function generateAndSaveWeeklySummary(
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.
-   skipped: generateAndSaveMonthlySummary — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 13 missing/modified: export async function generateAndSaveMonthlySummary(
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.

## Advisory Findings
- COV-004 (Async Operation Spans):164: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):383: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):627: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-006 (isRecording Guard):39: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):43: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):62: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):123: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):283: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):520: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
