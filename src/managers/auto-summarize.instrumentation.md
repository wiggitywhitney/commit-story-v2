# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 22.6K
- **Output tokens**: 12.4K

## Schema Extensions
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`
- `span.commit_story.journal.trigger_auto_monthly_summaries`
- `commit_story.journal.weeks_count`

## Validation Journey
1. **Attempt 1**: 29 blocking errors (NDS-003 (Code Preserved):29)
2. **Attempt 2**: 0 errors

## Notes
- All three schema-defined span names that semantically match these functions (commit_story.journal.run_summarize, commit_story.journal.run_weekly_summarize, commit_story.journal.run_monthly_summarize) were already claimed by earlier files in this run, so unique names were invented. The SCH-001 advisories note semantic similarity — these are different operation classes (auto-trigger orchestrators vs. the run_* entry points) so the distinct names are intentional.
- getErrorMessage is a pure synchronous helper with no I/O and is unexported — skipped per RST-001 and RST-004.
- Inner catch blocks inside the for-loops in all three functions push to result.failed and continue without rethrowing — treated as graceful-degradation catches and not marked with recordException/setStatus per NDS-007.
- commit_story.journal.weeks_count was invented as a schema extension because the registry has symmetric attributes for days (commit_story.journal.dates_count) and months (commit_story.journal.months_count) but no equivalent for weeks. The new attribute follows the same naming pattern.
- CDQ-007 advisories addressed by guarding all three unsummarized* array .length accesses with `if (x != null)` checks before setAttribute calls.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
