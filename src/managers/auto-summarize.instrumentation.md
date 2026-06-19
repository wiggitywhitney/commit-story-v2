# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.4K
- **Output tokens**: 7.2K

## Schema Extensions
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`
- `span.commit_story.journal.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- triggerAutoSummaries: The schema defines span names run_summarize, run_weekly_summarize, and run_monthly_summarize, but these names are already in use by earlier files in this instrumentation run. New span names trigger_auto_summaries, trigger_auto_weekly_summaries, and trigger_auto_monthly_summaries were invented to avoid collision and declared as schema extensions.
- triggerAutoSummaries: The inner catch blocks inside the for loop catch per-day errors and push them into result.failed/result.errors arrays without rethrowing. These are graceful-degradation catches — no recordException or setStatus(ERROR) was added to them (NDS-007: expected-condition catches must not receive error recording).
- triggerAutoSummaries: The final return is an object literal spread (not a call expression), so return-value capture is not permitted. Instead, setAttribute calls for generated_count and failed_count are placed immediately before the return statement using arithmetic on already-existing variables weeklyResult and monthlyResult, avoiding any NDS-003 violation.
- getErrorMessage: Pure synchronous helper with no I/O — skipped (RST-001: no spans on synchronous data transformations). Also unexported (RST-004).
- All attributes used (commit_story.journal.dates_count, commit_story.journal.weeks_count, commit_story.journal.months_count, commit_story.journal.generated_count, commit_story.journal.failed_count) are already registered in the schema — no new attribute keys were declared.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):122: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):186: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
