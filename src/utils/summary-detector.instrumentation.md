# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 17.8K
- **Output tokens**: 12.9K

## Schema Extensions
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.find_unsummarized_months`
- `commit_story.summary.entry_days_count`
- `commit_story.summary.unsummarized_days_count`
- `commit_story.summary.daily_summary_days_count`
- `commit_story.summary.unsummarized_weeks_count`
- `commit_story.summary.unsummarized_months_count`

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 0 errors

## Notes
- getTodayString and getNowDate are unexported synchronous pure helpers with no I/O — both skipped (RST-001: no spans on synchronous utilities; RST-004: unexported internal functions are not instrumented directly).
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are all unexported async I/O helpers — skipped per RST-004; their I/O becomes visible through context propagation as child activity under the exported orchestrator spans.
- Inner try/catch blocks inside getDaysWithEntries and getDaysWithDailySummaries handle expected ENOENT-style filesystem errors (directory does not exist) and return gracefully — these are control-flow catches and do not get recordException/setStatus. The attribute is set to 0 in those early-return paths.
- The early-return guards (if (entryDays.length === 0) return []) in findUnsummarizedDays, findUnsummarizedWeeks, and findUnsummarizedMonths are preserved exactly as single-line statements — no attribute is set on those paths to avoid modifying the original code structure (NDS-003).
- Five new count attributes were invented because the schema has no registered keys for result cardinality in the summary detector domain. The closest registered attributes (commit_story.context.messages_count, commit_story.context.sessions_count) are semantically scoped to context collection, not summary gap detection.

## Advisory Findings
- COV-004 (Async Operation Spans):112: "getSummarizedDays" (async function) at line 112 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):174: "getSummarizedWeeks" (async function) at line 174 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):287: "getSummarizedMonths" (async function) at line 287 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):312: "getWeeksWithWeeklySummaries" (async function) at line 312 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
