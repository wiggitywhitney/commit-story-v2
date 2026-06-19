# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 20.5K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`
- `span.commit_story.journal.find_unsummarized_months`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString and getNowDate are pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous non-I/O utilities) and RST-004 (unexported internal helpers).
- The four unexported async functions getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are instrumented per COV-004 because they perform async filesystem I/O (readdir) and the pre-instrumentation analysis explicitly requires spans for them. Each has a distinct async I/O path that benefits from individual span visibility as child spans of their calling orchestrators.
- All inner try/catch blocks in every function are graceful-degradation catches: they handle ENOENT-style directory-not-found errors and return empty collections ([], new Set()) without rethrowing. No recordException or setStatus(ERROR) is added to these catches per NDS-007 — they represent expected control flow, not failures. Only the outer span-level catch (which pairs with finally { span.end() }) records errors.
- commit_story.journal.entries_count is used in getDaysWithEntries for the total count of dates found with journal entries, and reused in findUnsummarizedDays for the input count of entry days before filtering — both represent counts of journal entry dates.
- commit_story.journal.daily_summaries_count is used in both getSummarizedDays (Set.size of summarized days) and getDaysWithDailySummaries (array length) since both return the count of dates backed by daily summary files. It is also used in findUnsummarizedWeeks for the input count of daily summary dates available for week grouping.
- commit_story.journal.weekly_summaries_count is used in getSummarizedWeeks (Set.size of weeks with existing summaries) and getWeeksWithWeeklySummaries (array length of all weekly summary files found) — both represent counts of weeks that have weekly summary files.
- commit_story.journal.weeks_count is used in findUnsummarizedWeeks for the output count of unsummarized weeks, and in findUnsummarizedMonths for the input count of week labels being processed — both are counts of ISO week strings within their respective operations.
- commit_story.journal.months_count is used in getSummarizedMonths (Set.size of summarized months) and findUnsummarizedMonths (output count of unsummarized months) — both are counts of YYYY-MM month strings; the span name provides context distinguishing summarized vs. unsummarized.
- The basePath parameter is not set as a span attribute on any span. CDQ-007 recommends using path.basename() over raw filesystem paths, but basename is not imported in this file (only join is imported from node:path). Adding a new non-OTel import solely for CDQ-007 compliance is prohibited, so the raw path is omitted and noted here as a known limitation.
- commit_story.journal.dates_count is used in findUnsummarizedDays for the output count of unsummarized date strings after filtering — no more semantically precise registered key exists for this filtered subset count.
- 9 new span names are declared in schemaExtensions. None of the existing schema-defined span IDs (e.g., commit_story.journal.read_day_entries, commit_story.journal.discover_reflections) match the operations in this file — those names are already claimed by other files and represent different operations.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):130: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):153: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):168: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):204: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):241: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):264: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):292: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):328: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):365: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):388: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):428: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
