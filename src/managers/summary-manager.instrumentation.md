# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 49.3K
- **Output tokens**: 50.3K

## Schema Extensions
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.generate_and_save_monthly`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 7 blocking errors (NDS-003 (Code Preserved):7)
3. **Attempt 3**: 0 errors

## Notes
- The three pipeline functions (generateAndSaveDailySummary, generateAndSaveWeeklySummary, generateAndSaveMonthlySummary) are the highest-value instrumentation targets — each orchestrates the full read-generate-save pipeline for a period. The schema span names for these operations (commit_story.summary.generate_daily_summary etc.) were already claimed by earlier files in this run, so new names were invented: generate_and_save_daily/weekly/monthly, reported as schema extensions.
- formatDailySummary, formatWeeklySummary, formatMonthlySummary, getWeekBoundaries, and getMonthBoundaries are pure synchronous helpers with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- readDayEntries, saveDailySummary, readWeekDailySummaries, saveWeeklySummary, readMonthWeeklySummaries, and saveMonthlySummary are exported async I/O functions. They were skipped to stay within the ~20% ratio backstop (instrumenting all would cover 64% of functions). Their I/O becomes child spans of the parent pipeline spans through context propagation.
- Two new schema attributes were introduced: commit_story.summary.week_label (ISO week string like '2026-W09') and commit_story.summary.month_label (month string like '2026-02'). No existing registered key captures these period identifiers — commit_story.journal.entry_date is defined as YYYY-MM-DD format only, making it semantically wrong for week and month strings.
- The inner access() catch blocks inside each pipeline function are expected-condition catches (checking for pre-existing files as a duplicate-detection guard). They were left without recordException/setStatus because file-not-found is the normal happy path, not an error condition.

## Advisory Findings
- COV-004 (Async Operation Spans):29: "readDayEntries" (async function) at line 29 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
- COV-004 (Async Operation Spans):88: "saveDailySummary" (async function) at line 88 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
- COV-004 (Async Operation Spans):213: "readWeekDailySummaries" (async function) at line 213 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
- COV-004 (Async Operation Spans):275: "saveWeeklySummary" (async function) at line 275 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
- COV-004 (Async Operation Spans):394: "readMonthWeeklySummaries" (async function) at line 394 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
- COV-004 (Async Operation Spans):474: "saveMonthlySummary" (async function) at line 474 is exported and async but has no span. Context propagation is not a valid COV-004 exemption for exported async I/O functions. The only valid reason to skip this function is RST-001 (synchronous, no I/O). RST-004 (unexported function) does not apply since this function is exported.
