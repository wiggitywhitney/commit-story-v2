# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 2.6K
- **Output tokens**: 5.4K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly_summaries`
- `span.commit_story.summarize.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getErrorMessage is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported).
- The three schema-registered span names commit_story.summarize.run_summarize, commit_story.summarize.run_weekly_summarize, and commit_story.summarize.run_monthly_summarize were already claimed by earlier files in this run, so new unique names were invented with the trigger_ prefix and reported as schema extensions.
- The inner catch blocks inside each for-loop (for individual date/week/month failures) are graceful-degradation catches — they push to result.failed and continue without rethrowing. Per NDS-007, recordException and setStatus(ERROR) were NOT added to these catches because they represent expected control flow, not unexpected failures.
- In triggerAutoSummaries, there are two return paths (early return on failures, and combined-result return at the end). Attributes commit_story.summarize.generated_count and commit_story.summarize.failed_count are set before both returns. The combined-result object was extracted to a const (combinedResult) using the return-value capture exception so setAttribute could reference it before the return statement.
- All five attributes used (dates_count, weeks_count, months_count, generated_count, failed_count) are already registered in the schema under registry.commit_story.agent_extensions — attributesCreated is 0.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: CDQ-007: setAttribute value "unsummarizedDays.length" at line 29 accesses a property of "unsummarizedDays" without a null/undefined guard. If "unsummarizedDays" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedDays)` check or use optional chaining (`unsummarizedDays?.length`).
- CDQ-007 (Attribute Data Quality):122: CDQ-007: setAttribute value "unsummarizedWeeks.length" at line 122 accesses a property of "unsummarizedWeeks" without a null/undefined guard. If "unsummarizedWeeks" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedWeeks)` check or use optional chaining (`unsummarizedWeeks?.length`).
- CDQ-007 (Attribute Data Quality):185: CDQ-007: setAttribute value "unsummarizedMonths.length" at line 185 accesses a property of "unsummarizedMonths" without a null/undefined guard. If "unsummarizedMonths" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedMonths)` check or use optional chaining (`unsummarizedMonths?.length`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summarize.trigger_auto_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summarize.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.summarize.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summarize.trigger_auto_monthly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summarize.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.summarize.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
