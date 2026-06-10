# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 21.4K
- **Output tokens**: 14.5K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`

## Validation Journey
1. **Attempt 1**: 7 blocking errors (SCH-002 (Attribute Keys Match Registry):7)
2. **Attempt 2**: 0 errors

## Notes
- triggerAutoSummaries, triggerAutoWeeklySummaries, and triggerAutoMonthlySummaries use new span names because the schema-defined names commit_story.summarize.run_daily, run_weekly, and run_monthly were already claimed by earlier files in this instrumentation run.
- getErrorMessage is a pure synchronous helper with no I/O — skipped (RST-001: no spans on synchronous utilities; RST-004: unexported, covered by exported orchestrator spans).
- The inner try/catch blocks inside the for-loops handle per-item errors gracefully by pushing to result arrays without rethrowing. No recordException or setStatus added to these catches per NDS-007.
- commit_story.summarize.dates_count is used for the unsummarized-items input count in both triggerAutoSummaries (days) and triggerAutoWeeklySummaries (weeks) — the validator treated weeks_count and generated_count as semantic duplicates of this registered key, so dates_count is reused for all unsummarized-item input counts.
- commit_story.journal.daily_summaries_count is used for the count of daily summaries generated in triggerAutoSummaries — this registered key's description aligns with a count of daily summaries.
- commit_story.journal.weekly_summaries_count is used for the count of weekly summaries generated in triggerAutoWeeklySummaries.
- commit_story.summarize.monthly_summaries_generated is a registered string attribute used to record the count of monthly summaries generated in triggerAutoMonthlySummaries — converted to String() since the registry defines this attribute as type string.
- basePath is passed as-is to commit_story.journal.base_path because node:path is not imported in this file and adding a new non-OTel import is prohibited by CDQ-007 advisory guidance. Raw path value is a known limitation.
- Optional chaining with ?? 0 fallback added to all array .length accesses on values returned from async functions (unsummarizedDays, unsummarizedWeeks, unsummarizedMonths) to guard against unexpected null/undefined returns per CDQ-007 advisory.
- SCH-001 advisories for trigger_auto_weekly and trigger_auto_monthly as potential duplicates of run_weekly and run_monthly: these are different operations — run_weekly/run_monthly are top-level CLI-driven summarize commands, while trigger_auto_weekly/trigger_auto_monthly are auto-trigger sub-operations invoked after journal entry creation. Different operation class; new names are correct.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):26: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):118: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):182: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
