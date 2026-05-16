# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 20.3K
- **Output tokens**: 9.6K

## Schema Extensions
- `span.commit_story.summary.trigger_auto_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`
- `span.commit_story.summary.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 29 blocking errors (NDS-003 (Code Preserved):29)
2. **Attempt 2**: 0 errors

## Notes
- getErrorMessage is a synchronous, unexported pure helper with no I/O — skipped (RST-001, RST-004).
- The schema defines run_summarize/run_weekly_summarize/run_monthly_summarize span names, but all three are already claimed by earlier files in this run. New unique names trigger_auto_summaries, trigger_auto_weekly_summaries, trigger_auto_monthly_summaries were invented with the commit_story.summary prefix.
- SCH-001 advisories for trigger_auto_weekly_summaries and trigger_auto_monthly_summaries being potential duplicates of trigger_auto_summaries are false positives — these are distinct operations targeting different cadences (weekly vs monthly vs daily).
- commit_story.summary.day_count, week_count, and month_count are all registered schema attributes used to capture unsummarized item counts. Guards added with != null per CDQ-007 advisory since the return values of findUnsummarized* functions are externally sourced.
- The original multi-line import statements and the multi-line return object in triggerAutoSummaries were preserved exactly as they appeared in the source. The triggerAutoMonthlySummaries function signature spans multiple lines in the original and is preserved that way.
- Inner catch blocks inside the for loops are graceful-degradation catches (they accumulate into result.failed without rethrowing) — no recordException/setStatus added per NDS-007.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
