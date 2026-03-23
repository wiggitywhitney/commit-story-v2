# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.2K
- **Output tokens**: 4.9K

## Schema Extensions
- `span.commit_story.auto_summarize.trigger_all`
- `span.commit_story.auto_summarize.trigger_weekly`
- `span.commit_story.auto_summarize.trigger_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- New span names were invented for all three exported functions because the schema-defined names `commit_story.summarize.run_daily`, `commit_story.summarize.run_weekly`, and `commit_story.summarize.run_monthly` were already declared by earlier files in this instrumentation run and cannot be reused for these different auto-trigger orchestrator functions.
- The inner per-item catch blocks inside the for-loops were intentionally NOT given `recordException`/`setStatus` because they represent expected control-flow failures — individual item failures are accumulated into `result.failed` and the loop continues. These catches have no rethrow and represent graceful degradation, not unexpected errors.
- The `triggerAutoSummaries` function has two return paths (early return on daily failures, and combined final return). Both paths set `generated_count` and `failed_count` attributes before returning, ensuring the span always carries outcome attributes regardless of which exit path is taken.
- The `getErrorMessage` helper was skipped per RST-001/RST-003 — it is a pure synchronous utility under 5 lines and not an exported function.
- All three schema extensions reuse existing registered attribute keys (`commit_story.summarize.input_count`, `commit_story.summarize.generated_count`, `commit_story.summarize.failed_count`) — no new attributes were created. The only extensions are the three new span names for the auto-trigger orchestrators, which have no semantic equivalent in the schema's existing `run_*` spans (those cover a different invocation path).
