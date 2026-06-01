# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 23.2K
- **Output tokens**: 20.1K
- **Cached tokens**: 23.9K

## Schema Extensions
- `span.commit_story.commands.run_summarize`
- `span.commit_story.commands.run_weekly_summarize`
- `span.commit_story.commands.run_monthly_summarize`
- `commit_story.summary.dates_count`
- `commit_story.summary.force`
- `commit_story.summary.generated_count`
- `commit_story.summary.weeks_count`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
2. **Attempt 2**: 0 errors

## Notes
- isValidDate is an unexported synchronous validator with no I/O — skipped (RST-001: no spans on pure synchronous utilities, RST-004: unexported and covered by the exported orchestrators that call it).
- isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, showSummarizeHelp are exported but synchronous with no I/O — skipped (RST-001: spans are not added to pure synchronous transformations regardless of export status).
- The inner catch blocks inside the for loops in runSummarize, runWeeklySummarize, and runMonthlySummarize handle per-item failures gracefully by pushing to result.failed/result.errors without rethrowing — no recordException or setStatus added to them (NDS-007: graceful-degradation catches that do not propagate the error must not be marked as errors).
- SCH-002 fix: removed commit_story.summary.months_count and reused commit_story.summary.weeks_count in runMonthlySummarize. The validator treated months_count as a semantic duplicate of weeks_count (both capture the count of time-period items in a batch request). Using weeks_count for the monthly function's input count keeps the schema minimal.
- CDQ-007 fix: added if (dates != null), if (weeks != null), and if (months != null) guards before accessing .length on each destructured array. These values come from options destructuring and could theoretically be undefined if the caller omits the field.
- New attribute commit_story.summary.dates_count: no registered key captures 'number of date strings submitted for daily summary generation'. commit_story.journal.entries_count describes journal entries within a file, not date targets in a batch request.
- New attribute commit_story.summary.force: no registered key captures the force-overwrite boolean flag passed to all three summarize commands.
- New attribute commit_story.summary.generated_count: no registered key captures 'number of summaries successfully generated in this batch run'. Semantically distinct from word counts, quote counts, or journal entries counts in the registry.
- New attribute commit_story.summary.weeks_count (reused for months): originally introduced for weekly batch size. The validator determined months_count was a semantic duplicate, so runMonthlySummarize also uses this key to record the number of months being processed.
- Span names commit_story.commands.run_summarize, commit_story.commands.run_weekly_summarize, and commit_story.commands.run_monthly_summarize are new — no schema span definitions match these CLI orchestrator entry points. The commands category distinguishes CLI handler functions from the underlying summary-manager operations they delegate to. SCH-001 advisory about run_weekly_summarize and run_summarize being potential duplicates is ignored — they operate on different time-period granularities (dates vs weeks) and have distinct logic paths.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
