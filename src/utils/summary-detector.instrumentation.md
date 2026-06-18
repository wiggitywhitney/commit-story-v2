# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 13.7K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.journal.unsummarized_days_count`
- `commit_story.journal.unsummarized_weeks_count`
- `commit_story.journal.unsummarized_months_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString is a pure synchronous helper that formats a date — it performs no I/O and has no async operations, so no span is added (RST-001: no spans on synchronous utilities without I/O).
- getNowDate is a pure synchronous helper that constructs a Date object — it performs no I/O and has no async operations, so no span is added (RST-001: no spans on synchronous utilities without I/O).
- The inner try/catch blocks inside getDaysWithEntries, getSummarizedDays, getDaysWithDailySummaries, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries all handle readdir failures by returning empty collections or continuing — these are graceful-degradation catches with no rethrow, so recordException and setStatus(ERROR) are not added to them (NDS-007: do not add error recording to expected-condition catches).
- Used commit_story.journal.entries_count (registered) for the count of entry dates returned by getDaysWithEntries — this attribute captures the count of journal entry days found, which matches the function's output semantically.
- Used commit_story.journal.summaries_count (registered) across getSummarizedDays, getDaysWithDailySummaries, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries — its brief is the generic agent-discovered label which does not restrict to a single summary type, so it applies across daily, weekly, and monthly summary counts. The span name provides the necessary context to distinguish which summary type the count refers to.
- Declared commit_story.journal.unsummarized_days_count as a new extension (int) for findUnsummarizedDays because no registered key captures 'count of days that have entries but no daily summary' — commit_story.journal.entries_count counts all entry days (including summarized ones), making it semantically incorrect here.
- Declared commit_story.journal.unsummarized_weeks_count as a new extension (int) for findUnsummarizedWeeks — no registered key captures 'count of weeks that have daily summaries but no weekly summary'. commit_story.journal.summaries_count counts existing summaries found, not gaps remaining.
- Declared commit_story.journal.unsummarized_months_count as a new extension (int) for findUnsummarizedMonths — no registered key captures 'count of months that have weekly summaries but no monthly summary' for the same reason as unsummarized_weeks_count.
- For findUnsummarizedDays, the original return expression was return entryDays.filter(...) — a call expression — which was captured to const result using the return-value capture exception so that span.setAttribute could reference result.length before returning.
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported async functions that perform filesystem I/O and are not covered by any auto-instrumentation library. Since they are on execution paths not directly wrapped by an exported orchestrator span (they are called from within already-spanned exported functions but each performs meaningful independent I/O), they are instrumented as COV-004 targets for visibility into filesystem access latency at each tier.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):130: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):167: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):203: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):240: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):290: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):326: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):363: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):425: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
