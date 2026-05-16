# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 35.1K
- **Output tokens**: 47.4K
- **Cached tokens**: 70.5K

## Schema Extensions
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `span.commit_story.summary.run_monthly_summarize`
- `commit_story.summary.month_count`

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
1. **Attempt 1**: 12 blocking errors (NDS-003 (Code Preserved):12)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: 11 blocking errors (NDS-003 (Code Preserved):11)
4. **Attempt 4**: function-level: 7/7 functions instrumented

## Notes
- runSummarize, runWeeklySummarize, runMonthlySummarize are the three exported async entry points and each receives a span (COV-001). The schema already defines spans for the imported manager functions they call, so no additional span wrapping is added for those sub-calls (RST-004, callee already owns that layer).
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, showSummarizeHelp are all synchronous functions with no I/O — skipped per RST-001.
- The inner try/catch blocks inside the for loops in all three functions do not rethrow — they push to result.failed and continue the loop. These are graceful-degradation catches (NDS-007), so no recordException/setStatus was added to them. The outer span-level catch (COV-003) handles unexpected errors that escape the loop.
- The empty catch block inside runSummarize (catch { // Doesn't exist, proceed }) handles the expected fs.access ENOENT condition — it is a control-flow catch and receives no error recording (NDS-007).
- commit_story.summary.day_count is used for the number of days to process in runSummarize — the registered brief 'Agent-discovered attribute' is broad enough to apply to the input day count. commit_story.summary.week_count is similarly used for runWeeklySummarize.
- commit_story.summarize.month_count is a new schema extension for runMonthlySummarize's input month count. The registered attribute commit_story.summary.month_label is a string type (for labeling a month), not an integer count, so it is not semantically equivalent. No other registered count attribute matches 'number of months to process'.
- span.commit_story.summarize.run_daily, span.commit_story.summarize.run_weekly, and span.commit_story.summarize.run_monthly are new span extensions — the schema defines spans for the underlying manager operations but not for these CLI orchestrator entry points.
- commit_story.summary.entry_count (registered) is set after each loop to record how many summaries were successfully generated, matching the registry brief for entry count in a summary context.
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
- CDQ-007 (Attribute Data Quality):506: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
