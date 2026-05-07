# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.2K
- **Output tokens**: 6.1K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getErrorMessage is a pure synchronous helper that returns a string — no I/O, no async, under 5 lines. Skipped per RST-001 (no spans on synchronous utilities).
- The schema defines span IDs commit_story.summarize.run_daily, run_weekly, and run_monthly, but all three were reported as already in use by earlier files in this run. New unique span names commit_story.summarize.trigger_auto_summaries, trigger_auto_weekly, and trigger_auto_monthly were invented and registered as schema extensions (SCH-001 cannot apply when the matching names are already claimed).
- The per-iteration catch blocks inside the for loops collect failures into result.failed and result.errors without rethrowing — these represent expected control flow (individual items failing while the loop continues). recordException and setStatus were NOT added to those catches, only to the outer span-lifecycle catch wrapping each function body (CDQ-003 exemption for expected-condition catches).
- In triggerAutoSummaries the early-return path (when result.failed.length > 0) sets generated_count and failed_count before returning, and the normal path extracts the final merged object to a const so attributes can be set before the return. This is the only allowed non-instrumentation variable extraction.
- All three attribute keys used (commit_story.summarize.input_count, commit_story.summarize.generated_count, commit_story.summarize.failed_count) are registered in the Weaver schema — no new attribute schema extensions were needed (attributesCreated = 0).
