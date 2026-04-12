# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.4K
- **Output tokens**: 17.6K
- **Cached tokens**: 17.9K

## Schema Extensions
- `span.commit_story.summarize.daily_summary_node`
- `span.commit_story.summarize.generate_daily_summary`
- `span.commit_story.summarize.weekly_summary_node`
- `span.commit_story.summarize.generate_weekly_summary`
- `span.commit_story.summarize.monthly_summary_node`
- `span.commit_story.summarize.generate_monthly_summary`
- `commit_story.summarize.week_label`
- `commit_story.summarize.month_label`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The inner try/catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode implement graceful degradation — they catch LLM errors and return degraded-but-valid state instead of throwing. Per the expected-condition catch rule, recordException/setStatus were NOT added to those inner catches; only an outer catch covers unexpected errors that escape the graceful fallback path.
- commit_story.summarize.date_count (already in schema) is reused in both daily and weekly contexts: in dailySummaryNode/generateDailySummary it represents the number of journal entries for the day; in weeklySummaryNode/generateWeeklySummary it represents the number of daily summaries being aggregated. The schema description 'count of dates' aligns with both interpretations.
- commit_story.summarize.week_label and commit_story.summarize.month_label are new schema extensions because no existing registered attribute captures a week identifier (e.g., '2026-W09') or month label (e.g., '2026-02'). commit_story.journal.entry_date expects YYYY-MM-DD format and is semantically distinct.
- getModel, resetModel, formatEntriesForSummary, cleanDailySummaryOutput, formatDailySummariesForWeekly, cleanWeeklySummaryOutput, formatWeeklySummariesForMonthly, cleanMonthlySummaryOutput are skipped: getModel/resetModel are trivial accessors (RST-002), the format/clean functions are pure synchronous data transformations (RST-001). The unexported parse helpers and graph builder/getter functions are skipped per RST-004.
- Both the node functions (dailySummaryNode, weeklySummaryNode, monthlySummaryNode) and their orchestrating generate functions are instrumented. The node functions are exported and async with LLM I/O; the generate functions are the public API entry points. LangChain auto-instrumentation covers the model.invoke() calls as child spans.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):486: Attribute key "commit_story.summarize.week_label" at line 486 may be redundant with registry entry "commit_story.summarize.week_count" (67% token overlap). Consider using the existing registry attribute instead of creating a new one.
- SCH-004 (No Redundant Schema Entries):711: Attribute key "commit_story.summarize.month_label" at line 711 may be redundant with registry entry "commit_story.summarize.month_count" (67% token overlap). Consider using the existing registry attribute instead of creating a new one.
