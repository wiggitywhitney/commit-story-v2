# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 43.8K
- **Output tokens**: 53.6K
- **Cached tokens**: 71.4K

## Schema Extensions
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `commit_story.summary.weeks_count`
- `commit_story.summary.generated_count`
- `commit_story.summary.failed_count`
- `span.commit_story.summary.run_monthly_summarize`
- `commit_story.summary.months_count`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| isValidWeekString | instrumented | 0 |
| isValidMonthString | instrumented | 0 |
| expandDateRange | instrumented | 0 |
| parseSummarizeArgs | instrumented | 0 |
| runSummarize | instrumented | 1 |
| runWeeklySummarize | instrumented | 1 |
| runMonthlySummarize | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 2 blocking errors (NDS-003 (Code Preserved):2)
2. **Attempt 2**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
3. **Attempt 3**: 2 blocking errors (NDS-003 (Code Preserved):2)
4. **Attempt 4**: function-level: 7/7 functions instrumented

## Notes
- runSummarize is the CLI entry point for daily summarization (COV-001). All schema-defined span names for daily summary generation (commit_story.summary.generate_daily, commit_story.summary.daily_node) are already in use by earlier files, so a new span name commit_story.summarize.run_daily is used for this CLI-layer orchestrator.
- runWeeklySummarize is the CLI entry point for weekly summarization (COV-001). commit_story.summarize.run_weekly is a new span name because commit_story.summary.generate_weekly and commit_story.summary.weekly_node are taken by earlier files in this run.
- runMonthlySummarize is the CLI entry point for monthly summarization (COV-001). commit_story.summarize.run_monthly is a new span name because commit_story.summary.generate_monthly and commit_story.summary.monthly_node are taken by earlier files in this run.
- For runSummarize, commit_story.summary.entries_count is set to result.generated.length after the loop completes — this reflects how many daily summaries were actually generated, which is semantically aligned with 'count of entries produced in a summary operation'.
- For runWeeklySummarize, commit_story.summary.week_label is set from weeks[0] when the array is non-empty (guarded by length check). The CLI always passes exactly one week, but the array contract requires the guard.
- For runMonthlySummarize, commit_story.summary.month_label is set from months[0] when the array is non-empty (guarded by length check). Same rationale as the weekly case.
- isValidDate is a synchronous pure helper with no I/O — no span added (RST-001: no spans on synchronous utilities). It is also unexported (RST-004).
- isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, and showSummarizeHelp are all synchronous functions with no I/O — no spans added (RST-001).
- The per-date, per-week, and per-month inner catch blocks inside each function's for loop do not rethrow — they accumulate errors into the result object and continue. No recordException or setStatus is added to these catches (NDS-007: graceful-degradation catches that do not propagate errors must not be marked as errors). The outer span-level catch handles unexpected failures outside the loop.
- The three new span names (span.commit_story.summarize.run_daily, span.commit_story.summarize.run_weekly, span.commit_story.summarize.run_monthly) use the 'summarize' category (not 'summary') to distinguish the CLI-layer command runners from the generation functions in summary-manager.js, which own the 'summary' category spans.
- Function-level fallback: 7/7 functions instrumented
-   instrumented: isValidWeekString (0 spans)
-   instrumented: isValidMonthString (0 spans)
-   instrumented: expandDateRange (0 spans)
-   instrumented: parseSummarizeArgs (0 spans)
-   instrumented: runSummarize (1 spans)
-   instrumented: runWeeklySummarize (1 spans)
-   instrumented: runMonthlySummarize (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):328: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):424: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):515: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
