# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 33.2K
- **Output tokens**: 38.8K
- **Cached tokens**: 57.0K

## Schema Extensions
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `commit_story.summary.force`
- `commit_story.summary.generated_count`
- `commit_story.summary.failed_count`
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
1. **Attempt 1**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
2. **Attempt 2**: 10 blocking errors (SCH-002 (Attribute Keys Match Registry):10)
3. **Attempt 3**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
4. **Attempt 4**: function-level: 7/7 functions instrumented

## Notes
- Function-level fallback: 7/7 functions instrumented
-   instrumented: isValidWeekString (0 spans)
-   instrumented: isValidMonthString (0 spans)
-   instrumented: expandDateRange (0 spans)
-   instrumented: parseSummarizeArgs (0 spans)
-   instrumented: runSummarize (1 spans)
-   instrumented: runWeeklySummarize (1 spans)
-   instrumented: runMonthlySummarize (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):329: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):429: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
