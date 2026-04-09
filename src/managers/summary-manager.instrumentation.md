# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 29.4K
- **Output tokens**: 21.2K

## Schema Extensions
- `span.commit_story.summarize.generate_and_save_daily`
- `span.commit_story.summarize.generate_and_save_weekly`
- `span.commit_story.summarize.generate_and_save_monthly`

## Validation Journey
1. **Attempt 1**: 18 blocking errors (NDS-003 (Code Preserved):18)
2. **Attempt 2**: 0 errors

## Notes
- All schema-defined span names for summarize pipelines were already claimed by earlier files. New names generate_and_save_* were invented to avoid collision.
- The previous submission incorrectly renamed `path` to `savedPath` to enable setAttribute — but the rules allow capturing return values to a const only when the original code did not already use a variable. Since the original code already used `const path = await save*()`, the original variable name must be preserved. setAttribute('commit_story.journal.file_path', path) is added after the existing `if (!path)` guard using the original variable name.
- Only the 3 pipeline orchestrators were instrumented (3/14 = 21%) to stay near the ratio threshold. The 6 async helper functions (readDayEntries, saveDailySummary, readWeekDailySummaries, saveWeeklySummary, readMonthWeeklySummaries, saveMonthlySummary) are all called from within the pipeline spans and their I/O is covered through context propagation.
- Inner try/catch blocks checking file existence via access() are expected-condition catches (ENOENT = proceed) and intentionally do not receive recordException/setStatus.

## Advisory Findings
- COV-004 (Async Operation Spans):29: "readDayEntries" (async function) at line 29 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):88: "saveDailySummary" (async function) at line 88 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):215: "readWeekDailySummaries" (async function) at line 215 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):277: "saveWeeklySummary" (async function) at line 277 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):398: "readMonthWeeklySummaries" (async function) at line 398 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):478: "saveMonthlySummary" (async function) at line 478 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
