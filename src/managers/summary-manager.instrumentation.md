# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.5K
- **Output tokens**: 33.3K
- **Cached tokens**: 22.6K

## Schema Extensions
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.generate_and_save_daily_summary`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_weekly_summary`
- `span.commit_story.summary.generate_and_save_weekly_summary`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.generate_and_save_monthly_summary`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Nine new span names are introduced under commit_story.summary.* — none of the existing schema spans (which all live under ai.*, context.*, git.*, and journal.*) match the summary manager's read/save/generate operations, so these are all schema extensions.
- formatDailySummary, formatWeeklySummary, formatMonthlySummary are pure synchronous string-formatting functions with no I/O — no spans added (RST-001: no spans on synchronous pure transformations).
- getWeekBoundaries and getMonthBoundaries are pure synchronous date-math helpers with no I/O — no spans added (RST-001).
- All inner try/catch blocks in the instrumented functions are graceful-degradation catches (file-not-found ENOENT checks and skip-on-error loops) that do not rethrow — no recordException or setStatus added to those inner catches (NDS-007). The outer span-level catch on each startActiveSpan wrapper handles unexpected errors per COV-003.
- In readDayEntries, the entries_count attribute is set only on the happy-path return (after the entries array is built). Early returns from the inner file-read catch and the empty-content guard do not set entries_count, but the file_path attribute is always set at span start, satisfying COV-005.
- In generateAndSaveDailySummary, entries_count is set after confirming entries is non-empty, and file_path is set only when path is non-null. The entry_date attribute is always set at span start, satisfying COV-005.
- In generateAndSaveWeeklySummary and generateAndSaveMonthlySummary, file_path is set only when the save returns a non-null path. The week_label/month_label attribute is always set at span start, satisfying COV-005.
- All attributes used (commit_story.journal.file_path, commit_story.journal.entry_date, commit_story.journal.entries_count, commit_story.journal.week_label, commit_story.journal.month_label) are registered keys — no new attribute extensions declared.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):33: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):52: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):104: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):162: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):177: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):320: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):389: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):542: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):611: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
