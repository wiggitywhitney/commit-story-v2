# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.4K
- **Output tokens**: 10.0K

## Schema Extensions
- `span.commit_story.summary.trigger_auto_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`
- `span.commit_story.summary.trigger_auto_monthly_summaries`
- `commit_story.summary.generated_count`
- `commit_story.summary.failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getErrorMessage is a synchronous pure helper (no I/O) and is unexported — skipped per RST-001 and RST-004.
- All three exported functions received new span names because the schema-registered span names for similar operations (run_summarize, run_weekly_summarize, run_monthly_summarize) were already claimed by earlier files in this run. New names follow the commit_story.summary.<operation> pattern.
- The inner catch blocks inside the for-loops (catching per-day/week/month generation failures) push to result.failed and result.errors without rethrowing. Per NDS-007, recordException and setStatus were NOT added to these catches — they represent expected partial-failure control flow, not unrecoverable errors.
- commit_story.summary.generated_count is a new extension key: no registered key precisely describes 'count of summaries successfully generated and saved in this run.' The registered commit_story.summary.entries_count brief is too vague (auto-discovered with no specific context) to safely repurpose for this count.
- commit_story.summary.failed_count is a new extension key: no registered key describes 'count of date/week/month items that failed summary generation.' Inventing a precise key avoids ambiguity with the registered error-related attributes.
- In triggerAutoSummaries, span attributes for generated_count and failed_count are set on both the early-return path (daily failures only) and on the normal-completion path (combined daily+weekly+monthly totals), so the span always records outcome data regardless of exit path.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):122: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):185: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
