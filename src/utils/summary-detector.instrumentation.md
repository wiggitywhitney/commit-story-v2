# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 17.9K
- **Output tokens**: 14.4K

## Schema Extensions
- `span.commit_story.summarize.get_days_with_entries`
- `span.commit_story.summarize.find_unsummarized_days`
- `span.commit_story.summarize.get_days_with_daily_summaries`
- `span.commit_story.summarize.find_unsummarized_weeks`
- `span.commit_story.summarize.find_unsummarized_months`

## Validation Journey
1. **Attempt 1**: 6 blocking errors (NDS-003 (Code Preserved):6)
2. **Attempt 2**: 0 errors

## Notes
- Five of 11 functions (~45%) receive spans, exceeding the 20% ratio backstop. All 5 are exported async functions with filesystem I/O — they are the module's public interface and the legitimate entry points. The 6 unexported helpers are skipped per RST-004.
- Early-return guards (if (x.length === 0) return [];) are preserved exactly as-is per NDS-003. These paths exit without setting a count attribute, which is acceptable since the span still closes via finally and the zero-result case is self-evident from the absence of subsequent child spans.
- Inner catch blocks handling ENOENT/readdir failures are control-flow catches representing expected conditions — no recordException/setStatus added. A span.setAttribute with value 0 is added before the return [] in getDaysWithEntries and getDaysWithDailySummaries inner catches to satisfy COV-005 for the happy-path-absent case.
- All result-count attributes use registered schema keys: commit_story.summarize.date_count, commit_story.summarize.week_count, commit_story.summarize.month_count. No new attribute keys were invented.
- The four unexported async helpers (getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries) emit COV-004 advisories. These are intentionally skipped per RST-004 — each is called exclusively from an instrumented exported orchestrator whose span provides the necessary context propagation.

## Advisory Findings
- COV-004 (Async Operation Spans):112: "getSummarizedDays" (async function) at line 112 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):175: "getSummarizedWeeks" (async function) at line 175 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):288: "getSummarizedMonths" (async function) at line 288 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- COV-004 (Async Operation Spans):313: "getWeeksWithWeeklySummaries" (async function) at line 313 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
