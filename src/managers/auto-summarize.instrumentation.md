# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.1K
- **Output tokens**: 5.6K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly_summaries`
- `span.commit_story.summarize.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The schema defines spans commit_story.summarize.run_summarize, run_weekly_summarize, and run_monthly_summarize but these are already in use by earlier files in this run. Three new span names were invented for this file's auto-trigger variants: trigger_auto_summaries, trigger_auto_weekly_summaries, trigger_auto_monthly_summaries.
- Inner per-item catch blocks (inside the for loops) are expected-condition catches — they collect failures into result.failed rather than throwing. These were not given recordException/setStatus per the expected-condition catch exemption. Only the outer span-level catch handles unexpected failures.
- All attributes used (date_count, week_count, month_count, generated_count, failed_count) are already registered in the schema under commit_story.summarize.*, so attributesCreated is 0.
- The unexported helper getErrorMessage was skipped per RST-004.
- triggerAutoSummaries has two return paths (early return on failures, final combined return); attributes are set before each return path to ensure consistent telemetry regardless of which path executes.
