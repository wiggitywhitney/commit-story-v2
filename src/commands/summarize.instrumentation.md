# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: partial
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 35.3K
- **Output tokens**: 40.9K
- **Cached tokens**: 56.5K

## Schema Extensions
- `span.commit_story.journal.run_summarize`
- `commit_story.summary.dates_requested`
- `commit_story.summary.force`
- `span.commit_story.journal.run_weekly_summarize`
- `span.commit_story.journal.run_monthly_summarize`
- `commit_story.summary.months_generated_count`
- `commit_story.summary.months_failed_count`

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
2. **Attempt 2**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
3. **Attempt 3**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
4. **Attempt 4**: function-level: 7/7 functions instrumented
5. **Attempt 5**: reassembly: SCH-002: SCH-002 check failed: declared attribute extension "commit_story.summary.dates_requested" is used with an inconsistent value source at line 435 ("weeks") — it was first used with "dates" at line 330, a different concept. Declare a separate attribute key for this value, or use this key consistently for the same concept everywhere it appears in this file.; SCH-002: SCH-002 check failed: declared attribute extension "commit_story.summary.dates_requested" is used with an inconsistent value source at line 523 ("months") — it was first used with "dates" at line 330, a different concept. Declare a separate attribute key for this value, or use this key consistently for the same concept everywhere it appears in this file.

## Notes
- Function-level fallback: 7/7 functions instrumented
-   instrumented: isValidWeekString (0 spans)
-   instrumented: isValidMonthString (0 spans)
-   instrumented: expandDateRange (0 spans)
-   instrumented: parseSummarizeArgs (0 spans)
-   instrumented: runSummarize (1 spans)
-   instrumented: runWeeklySummarize (1 spans)
-   instrumented: runMonthlySummarize (1 spans)
- Reassembly validation failed — using partial results. Failing rules: SCH-002: SCH-002 check failed: declared attribute extension "commit_story.summary.dates_requested" is used with an inconsistent value source at line 435 ("weeks") — it was first used with "dates" at line 330, a different concept. Declare a separate attribute key for this value, or use this key consistently for the same concept everywhere it appears in this file.; SCH-002: SCH-002 check failed: declared attribute extension "commit_story.summary.dates_requested" is used with an inconsistent value source at line 523 ("months") — it was first used with "dates" at line 330, a different concept. Declare a separate attribute key for this value, or use this key consistently for the same concept everywhere it appears in this file.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):435: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):522: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
