# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.5K
- **Output tokens**: 5.6K

## Schema Extensions
- `span.commit_story.commands.trigger_auto_summaries`
- `span.commit_story.commands.trigger_auto_weekly_summaries`
- `span.commit_story.commands.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- triggerAutoSummaries, triggerAutoWeeklySummaries, and triggerAutoMonthlySummaries are all COV-001 exported entry points and each received a span. The schema-defined span names commit_story.commands.run_summarize, run_weekly_summarize, and run_monthly_summarize were already taken by earlier files, so new names were invented: commit_story.commands.trigger_auto_summaries, trigger_auto_weekly_summaries, trigger_auto_monthly_summaries.
- getErrorMessage is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported function whose execution path is covered by the exported orchestrator spans).
- The inner catch blocks inside each loop do not rethrow — they push to result.failed/result.errors and continue. These are graceful-degradation catches per NDS-007, so recordException and setStatus(ERROR) were not added to them. The outer span-level catch handles unexpected errors that propagate out of the function.
- All attributes used (commit_story.journal.unsummarized_days_count, commit_story.journal.unsummarized_weeks_count, commit_story.journal.unsummarized_months_count, commit_story.journal.summaries_count) are already registered in the schema — no new attribute extensions needed.
- In triggerAutoSummaries, the summaries_count attribute is set at both the early-return path (when failures exist) and the final return path (summing daily + weekly + monthly generated counts), ensuring the attribute is present on all exit paths.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):119: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):181: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
