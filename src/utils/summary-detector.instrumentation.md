# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 18.1K
- **Output tokens**: 13.3K

## Schema Extensions
- `span.commit_story.summary_detector.get_days_with_entries`
- `span.commit_story.summary_detector.find_unsummarized_days`
- `span.commit_story.summary_detector.get_days_with_daily_summaries`
- `span.commit_story.summary_detector.find_unsummarized_weeks`
- `span.commit_story.summary_detector.find_unsummarized_months`
- `commit_story.summary_detector.result_count`

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 0 errors

## Notes
- Unexported async helpers (getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries) were skipped per RST-004 — they are called only from exported orchestrators that already have spans.
- Inner try/catch blocks (readdir error handling) are expected-condition catches for missing directories returning graceful empty results — no recordException/setStatus added per the Error Handling rules.
- Early-return guards (if length === 0 return []) are preserved verbatim. The result_count attribute is only set on the normal completion path where results are actually computed; this avoids modifying those guard lines while still providing diagnostic value on the paths that do work.
- New attribute commit_story.summary_detector.result_count was created because no registered key semantically covers count of filesystem-scanned items returned by a detector function. commit_story.summarize.input_count was considered but is semantically bound to summarization pipeline inputs, not detector scan results.

## Advisory Findings
- COV-004 (Async Operation Spans):111: "getSummarizedDays" (async function) at line 111 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):173: "getSummarizedWeeks" (async function) at line 173 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):285: "getSummarizedMonths" (async function) at line 285 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):310: "getWeeksWithWeeklySummaries" (async function) at line 310 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
