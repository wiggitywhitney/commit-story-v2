# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.4K
- **Output tokens**: 6.5K

## Schema Extensions
- `span.commit_story.auto_summarize.trigger_daily`
- `span.commit_story.auto_summarize.trigger_weekly`
- `span.commit_story.auto_summarize.trigger_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getErrorMessage is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported internal function covered by the exported orchestrators that call it).
- The inner catch blocks inside the per-day/week/month loops are graceful-degradation catches — they push to result.failed and continue without rethrowing. No recordException/setStatus was added to these catches (NDS-007: do not add error recording to catches that handle expected conditions without propagating the error).
- triggerAutoSummaries sets commit_story.summary.generated_count on both the early-return path (when daily failures trigger the skip-weekly/monthly guard) and the normal path (summing daily + weekly + monthly generated counts) so the attribute is always present regardless of which return path executes.
- New span names commit_story.auto_summarize.trigger_daily, commit_story.auto_summarize.trigger_weekly, and commit_story.auto_summarize.trigger_monthly were invented because no schema-defined span matched these auto-trigger orchestration operations. The schema spans for run_summarize/run_weekly_summarize/run_monthly_summarize are already claimed by CLI command entry points in earlier files; these auto-trigger functions are a distinct operational layer invoked post-journal-entry-creation.
- All attributes used (commit_story.summary.dates_count, commit_story.summary.weeks_count, commit_story.summary.months_count, commit_story.summary.generated_count) are already registered in the schema — no new attribute keys were invented (attributesCreated = 0).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):119: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):181: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
