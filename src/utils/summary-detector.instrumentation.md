# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 5
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 9.9K

## Schema Extensions
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.find_unsummarized_months`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are all unexported async functions that perform filesystem I/O. Each is called exclusively from an exported orchestrator (findUnsummarizedDays, findUnsummarizedWeeks, findUnsummarizedMonths) that already has a span. Per RST-004, unexported helpers are skipped when an exported orchestrator covers the execution path — their I/O becomes child spans via context propagation. The pre-instrumentation analysis flagged them for COV-004, but RST-004 takes precedence for unexported functions.
- getTodayString and getNowDate are synchronous pure helpers with no I/O — they compute dates from environment variables and the system clock. No spans added (RST-001: no spans on synchronous utilities without I/O).
- The inner try/catch blocks inside getDaysWithEntries and getDaysWithDailySummaries handle expected directory-not-found conditions gracefully (returning [] or continuing). Per NDS-007, recordException and setStatus were not added to these catches since they represent normal control flow and do not propagate errors.
- commit_story.summary.read_day_entries was already in use by an earlier file in this run, so a new span name commit_story.summary.get_days_with_entries was invented for getDaysWithEntries to avoid collisions with a different operation. All five new span names follow the commit_story.summary.* namespace established by the schema.
- commit_story.summary.entries_count (registered) was used for the result count of getDaysWithEntries and getDaysWithDailySummaries. commit_story.summarize.dates_count, commit_story.summarize.weeks_count, and commit_story.summarize.months_count (all registered) were used for the respective findUnsummarized* return counts — all values were already computed in the function body and required only a capture before return.

## Advisory Findings
- COV-004 (Async Operation Spans):107: "getSummarizedDays" (async function) at line 107 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):169: "getSummarizedWeeks" (async function) at line 169 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):277: "getSummarizedMonths" (async function) at line 277 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- COV-004 (Async Operation Spans):302: "getWeeksWithWeeklySummaries" (async function) at line 302 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.
- CDQ-007 (Attribute Data Quality):94: CDQ-007: setAttribute value "dates.length" at line 94 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality):152: CDQ-007: setAttribute value "result.length" at line 152 accesses a property of "result" without a null/undefined guard. If "result" can be null or undefined, this will throw at runtime. Add an `if (result)` check or use optional chaining (`result?.length`).
- CDQ-007 (Attribute Data Quality):214: CDQ-007: setAttribute value "dates.length" at line 214 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality):260: CDQ-007: setAttribute value "unsummarized.length" at line 260 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- CDQ-007 (Attribute Data Quality):373: CDQ-007: setAttribute value "unsummarized.length" at line 373 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.find_unsummarized_days" may be a semantic duplicate of existing registry operation "commit_story.summary.get_days_with_entries". If these operations are equivalent, reuse "commit_story.summary.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.get_days_with_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.get_days_with_entries". If these operations are equivalent, reuse "commit_story.summary.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.find_unsummarized_weeks" may be a semantic duplicate of existing registry operation "commit_story.summary.find_unsummarized_days". If these operations are equivalent, reuse "commit_story.summary.find_unsummarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.find_unsummarized_months" may be a semantic duplicate of existing registry operation "commit_story.summary.find_unsummarized_weeks". If these operations are equivalent, reuse "commit_story.summary.find_unsummarized_weeks" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
