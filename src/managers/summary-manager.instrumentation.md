# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.4K
- **Output tokens**: 71.8K
- **Cached tokens**: 22.7K

## Schema Extensions
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_weekly_summary`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.generate_and_save_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The five synchronous functions — formatDailySummary, getWeekBoundaries, formatWeeklySummary, getMonthBoundaries, formatMonthlySummary — were skipped because they perform no I/O, are pure data transformations, and have no async operations to trace (RST-001: no spans on synchronous utilities).
- All inner catch blocks in this file are graceful-degradation catches: they either return [] (file not found, directory not found, unreadable files) or return null (file already exists for duplicate detection). None propagate the error. Per NDS-007, no recordException or setStatus(ERROR) was added to these catch blocks since they represent expected control flow, not failures.
- All 9 new span names are schema extensions because no schema span definitions matched the operations in this file (the existing schema spans like commit_story.summary.generate_daily cover generator graph nodes, not manager orchestration functions). Each schema extension follows the commit_story.summary.* namespace pattern established by the registry.
- getDateString(date) is called in readDayEntries and saveDailySummary purely to populate the commit_story.journal.entry_date attribute — this utility is already imported at the top of the file and used elsewhere, so calling it in these two functions for instrumentation purposes does not add a new dependency.
- File path attributes (summaryPath) were intentionally omitted from saveDailySummary and saveMonthlySummary spans because basename from node:path is not imported in this file and CDQ-007 prohibits adding new non-OTel imports to apply path transformations. The force flag and entry_date provide sufficient diagnostic context without raw paths.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):52: CDQ-007: setAttribute value "entries.length" at line 52 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality):163: CDQ-007: setAttribute value "entries.length" at line 163 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality):263: CDQ-007: setAttribute value "summaries.length" at line 263 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality):373: CDQ-007: setAttribute value "dailySummaries.length" at line 373 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality):480: CDQ-007: setAttribute value "summaries.length" at line 480 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality):593: CDQ-007: setAttribute value "weeklySummaries.length" at line 593 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.read_day_entries" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily". If these operations are equivalent, reuse "commit_story.summary.generate_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.save_daily_summary" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily". If these operations are equivalent, reuse "commit_story.summary.generate_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_and_save_daily" may be a semantic duplicate of existing registry operation "commit_story.summary.save_daily_summary". If these operations are equivalent, reuse "commit_story.summary.save_daily_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.read_week_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_weekly". If these operations are equivalent, reuse "commit_story.summary.generate_weekly" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.save_weekly_summary" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_and_save_daily". If these operations are equivalent, reuse "commit_story.summary.generate_and_save_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_and_save_weekly" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.read_month_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.read_week_daily_summaries". If these operations are equivalent, reuse "commit_story.summary.read_week_daily_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summary.generate_and_save_monthly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_monthly". If these operations are equivalent, reuse "commit_story.summary.generate_monthly" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
