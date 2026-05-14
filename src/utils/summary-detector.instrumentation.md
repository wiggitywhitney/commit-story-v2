# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 18.8K
- **Output tokens**: 13.1K

## Schema Extensions
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.find_unsummarized_months`

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 0 errors

## Notes
- Schema-defined span names like commit_story.summary.read_day_entries were already declared by earlier files, so unique names were invented for each exported function.
- Unexported helpers (getTodayString, getNowDate, getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries) skipped per RST-004 — all are called by exported orchestrators that have spans.
- Internal try/catch blocks around readdir are control-flow catches (expected ENOENT), not error conditions — recordException/setStatus not added inside them.
- Early-return paths (length === 0 guards) preserved exactly as original single-line form; setAttribute is only set on the success path where a result array is available.

## Advisory Findings
- COV-004 (Async Operation Spans):111: "getSummarizedDays" (async function) at line 111 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):173: "getSummarizedWeeks" (async function) at line 173 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):285: "getSummarizedMonths" (async function) at line 285 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):310: "getWeeksWithWeeklySummaries" (async function) at line 310 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
