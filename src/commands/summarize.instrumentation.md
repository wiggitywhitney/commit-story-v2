# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 37.8K
- **Output tokens**: 32.7K

## Schema Extensions
- `span.commit_story.journal.run_summarize`
- `commit_story.journal.dates_count`
- `commit_story.journal.force`
- `span.commit_story.journal.run_weekly_summarize`
- `commit_story.journal.weeks_count`
- `span.commit_story.journal.run_monthly_summarize`
- `commit_story.journal.months_count`
- `commit_story.journal.generated_count`
- `commit_story.journal.failed_count`

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
1. **Attempt 1**: 8 blocking errors (SCH-002 (Attribute Keys Match Registry):8)
2. **Attempt 2**: 1 blocking error (SCH-002 (Attribute Keys Match Registry):1)
3. **Attempt 3**: function-level: 7/7 functions instrumented

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
- CDQ-007 (Attribute Data Quality):329: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):432: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):518: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
