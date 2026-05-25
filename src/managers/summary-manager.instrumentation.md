# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: partial
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 68.8K
- **Output tokens**: 72.8K
- **Cached tokens**: 275.6K

## Schema Extensions
- `span.commit_story.journal.read_day_entries`
- `commit_story.journal.entries_count`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.read_week_dailies`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.read_month_weeklies`
- `span.commit_story.summary.save_monthly`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| readDayEntries | instrumented | 1 |
| formatDailySummary | instrumented | 0 |
| saveDailySummary | instrumented | 1 |
| generateAndSaveDailySummary | skipped — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 47 missing/modified: return { saved: false, reason: `Summary already exists for ${dateStr}` };
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |
| getWeekBoundaries | instrumented | 0 |
| readWeekDailySummaries | instrumented | 1 |
| formatWeeklySummary | instrumented | 0 |
| saveWeeklySummary | instrumented | 1 |
| generateAndSaveWeeklySummary | skipped — Validation failed: NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 61: formatted,
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |
| getMonthBoundaries | instrumented | 0 |
| readMonthWeeklySummaries | instrumented | 1 |
| formatMonthlySummary | instrumented | 0 |
| saveMonthlySummary | instrumented | 1 |
| generateAndSaveMonthlySummary | skipped — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 44: basePath
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 |

## Validation Journey
1. **Attempt 1**: 8 blocking errors (NDS-003 (Code Preserved):8)
2. **Attempt 2**: 8 blocking errors (NDS-003 (Code Preserved):8)
3. **Attempt 3**: function-level: 11/14 functions instrumented

## Notes
- formatDailySummary, formatWeeklySummary, formatMonthlySummary are pure synchronous markdown-building functions with no I/O — skipped per RST-001.
- getWeekBoundaries and getMonthBoundaries are pure synchronous date-calculation helpers with no I/O — skipped per RST-001.
- All nine new span names are schema extensions because the existing schema spans (commit_story.summary.generate_daily, commit_story.summary.daily_node, etc.) belong to the LangGraph generator layer in summary-graph.js, not the file-reading/writing orchestration layer in this manager. These are distinct operation classes.
- commit_story.summary.entries_count is used throughout to record the count of source items read at each stage (day entries, daily summaries, weekly summaries). The attribute's registered brief is generic enough to apply across all three pipeline levels.
- CDQ-007 null guards added with `if (x != null)` pattern for entries, summaries, dailySummaries, and weeklySummaries. These variables are always arrays in practice, but guards are added to satisfy the advisory.
- CDQ-007 filesystem path advisories for summaryPath: basename from node:path is not imported in this file (only join is imported). Adding a new import to comply with the advisory is prohibited by the rules, so the full summaryPath value is used as-is. This is a known limitation.
- SCH-001 advisories are false positives — the flagged span names are different operation classes (reading files vs generating via LangGraph, saving files vs orchestrating pipelines).
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
-   skipped: generateAndSaveDailySummary — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: original line 47 missing/modified: return { saved: false, reason: `Summary already exists for ${dateStr}` };
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.
-   skipped: generateAndSaveWeeklySummary — Validation failed: NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 61: formatted,
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.
-   skipped: generateAndSaveMonthlySummary — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 44: basePath
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.

## Advisory Findings
- COV-004 (Async Operation Spans):161: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):380: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans):625: COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-006 (isRecording Guard):38: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-006 (isRecording Guard):122: CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality):43: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):62: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):126: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):280: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):346: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):517: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):605: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
