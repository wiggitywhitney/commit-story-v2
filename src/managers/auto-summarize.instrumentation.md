# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.2K
- **Output tokens**: 4.7K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Three new span names were invented because the schema-defined names (run_summarize, run_weekly_summarize, run_monthly_summarize) were already declared by earlier files in this run. The auto-trigger variants (trigger_auto_summaries, trigger_auto_weekly, trigger_auto_monthly) are semantically distinct — they implement auto-detection and orchestration logic rather than direct invocation.
- The inner catch blocks inside the for loops were NOT given recordException/setStatus because they represent expected control-flow: individual day/week/month failures are collected into result.failed[] and the loop continues. These are graceful-degradation paths, not unexpected errors. The outer try/catch handles genuinely unexpected failures (e.g., findUnsummarizedDays throwing).
- triggerAutoSummaries has an early-return path when daily failures occur. setAttribute calls for generated_count and failed_count were added before both the early return and the normal return to ensure attributes are always set before span.end().
- getErrorMessage is an unexported synchronous utility under 5 lines — skipped per RST-001 and RST-004.
- All attributes used (dates_count, weeks_count, months_count, generated_count, failed_count) are already registered in the schema under the commit_story.summarize.* namespace, so attributesCreated is 0.
