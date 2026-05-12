# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 38.1K
- **Output tokens**: 56.5K
- **Cached tokens**: 45.8K

## Schema Extensions
- `span.commit_story.journal.run_summarize`
- `commit_story.journal.dates_count`
- `span.commit_story.journal.run_weekly_summarize`
- `span.commit_story.journal.run_monthly_summarize`
- `commit_story.journal.months_count`
- `commit_story.journal.monthly_summaries_generated_count`
- `commit_story.journal.monthly_summaries_failed_count`

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
1. **Attempt 1**: 13 blocking errors (NDS-003 (Code Preserved):13)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: 15 blocking errors (NDS-003 (Code Preserved):12, CDQ-001 (Spans Closed):3)
4. **Attempt 4**: function-level: 7/7 functions instrumented

## Notes
- `runSummarize`, `runWeeklySummarize`, and `runMonthlySummarize` use `tracer.startSpan()` instead of `tracer.startActiveSpan()` (which is the preferred pattern per CDQ-005). All three functions contain per-item try/catch blocks inside a for loop whose inner catches swallow errors without rethrowing. Using `startActiveSpan` with a callback wrapper would necessarily re-indent the existing for-loop try blocks (from 4 spaces to 8 spaces), violating NDS-003 line-content preservation. Using `startSpan` with explicit `span.end()` at the return point is the only structural approach that avoids modifying existing code indentation. Since all errors are caught gracefully inside the per-item catch blocks and nothing propagates to the function level, `span.end()` at the end of the function body is always reached.
- The three inner catch blocks in the for loops (`catch (err) { result.failed.push(...) ... }`) are graceful-degradation catches — they accumulate errors into the result object without rethrowing. Per NDS-007, `span.recordException` and `span.setStatus(ERROR)` are not added to these catches. Likewise, the file-not-found catch inside `runSummarize` (`catch { // Doesn't exist, proceed }`) is an expected-condition catch representing normal control flow.
- All schema-defined span names for daily/weekly/monthly summary operations (`commit_story.journal.daily_summary`, `commit_story.journal.generate_daily_summary`, `commit_story.journal.weekly_summary`, `commit_story.journal.create_weekly_summary`, `commit_story.journal.monthly_summary`, `commit_story.journal.generate_monthly_summary`) were already claimed by earlier files in this instrumentation run. New names `commit_story.summarize.run_daily`, `commit_story.summarize.run_weekly`, and `commit_story.summarize.run_monthly` were invented using the `commit_story` namespace prefix and the `summarize` category to distinguish CLI-level orchestration from manager-level generation.
- The schema includes `commit_story.journal.daily_summaries_count` and `commit_story.journal.weekly_summaries_count` but has no equivalent for monthly summaries. `commit_story.journal.monthly_summaries_count` was added as a schema extension (int type) to record the count of monthly summaries generated — directly parallel to the existing daily and weekly count attributes in the registry.
- Synchronous functions `isValidDate`, `isValidWeekString`, `isValidMonthString`, `expandDateRange`, `parseSummarizeArgs`, and `showSummarizeHelp` were all skipped — they perform no I/O, make no async calls, and contain no external calls (RST-001: no spans on pure synchronous utilities).
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
- CDQ-007 (Attribute Data Quality):512: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
