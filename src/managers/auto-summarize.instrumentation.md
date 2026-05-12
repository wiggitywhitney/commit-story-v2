# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 19.7K
- **Output tokens**: 8.8K

## Schema Extensions
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`
- `span.commit_story.journal.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 29 blocking errors (NDS-003 (Code Preserved):29)
2. **Attempt 2**: 0 errors

## Notes
- getErrorMessage is a pure synchronous unexported helper — skipped per RST-001 and RST-004.
- All schema-defined span names that could match these operations (run_summarize, run_weekly_summarize, run_monthly_summarize) were already declared by earlier files in this run. New unique names were invented: trigger_auto_summaries, trigger_auto_weekly_summaries, trigger_auto_monthly_summaries. The SCH-001 advisory about semantic duplication is acknowledged — these are different operation classes (trigger/orchestration layer vs. execution layer) and the distinct names are intentional.
- The inner catch blocks inside each for-loop are graceful-degradation catches — they accumulate errors into result.failed/result.errors without rethrowing. Per NDS-007, no recordException or setStatus is added to these inner catches. The outer span wrapper catch handles unexpected exceptions.
- The original imports used multi-line destructuring syntax. The instrumented output preserves this exact multi-line form to avoid NDS-003 violations. Similarly, the return object literal in triggerAutoSummaries uses multi-line array spreads to match the original structure.
- triggerAutoMonthlySummaries in the original source has its parameters on separate lines (basePath and options on their own lines). The instrumented output preserves this exact multi-line function signature.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.trigger_auto_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.run_summarize". If these operations are equivalent, reuse "commit_story.journal.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.trigger_auto_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.journal.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.trigger_auto_monthly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.journal.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
