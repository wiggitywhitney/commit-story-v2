# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 59.8K
- **Output tokens**: 58.8K
- **Cached tokens**: 47.8K

## Schema Extensions
- `span.commit_story.ai.generate_daily_summary`
- `commit_story.journal.entries_count`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.ai.generate_weekly_summary`
- `commit_story.journal.week_label`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.ai.generate_monthly_summary`
- `commit_story.journal.month_label`
- `span.commit_story.journal.generate_monthly_summary`

## Function-Level Results

| Function | Status | Spans |
|----------|--------|-------|
| formatEntriesForSummary | instrumented | 0 |
| cleanDailySummaryOutput | instrumented | 0 |
| dailySummaryNode | instrumented | 1 |
| generateDailySummary | instrumented | 1 |
| formatDailySummariesForWeekly | instrumented | 0 |
| cleanWeeklySummaryOutput | instrumented | 0 |
| weeklySummaryNode | instrumented | 1 |
| generateWeeklySummary | instrumented | 1 |
| formatWeeklySummariesForMonthly | instrumented | 0 |
| cleanMonthlySummaryOutput | instrumented | 0 |
| monthlySummaryNode | instrumented | 1 |
| generateMonthlySummary | instrumented | 1 |

## Validation Journey
1. **Attempt 1**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
2. **Attempt 2**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
3. **Attempt 3**: function-level: 12/12 functions instrumented

## Notes
- Function-level fallback: 12/12 functions instrumented
-   instrumented: formatEntriesForSummary (0 spans)
-   instrumented: cleanDailySummaryOutput (0 spans)
-   instrumented: dailySummaryNode (1 spans)
-   instrumented: generateDailySummary (1 spans)
-   instrumented: formatDailySummariesForWeekly (0 spans)
-   instrumented: cleanWeeklySummaryOutput (0 spans)
-   instrumented: weeklySummaryNode (1 spans)
-   instrumented: generateWeeklySummary (1 spans)
-   instrumented: formatWeeklySummariesForMonthly (0 spans)
-   instrumented: cleanMonthlySummaryOutput (0 spans)
-   instrumented: monthlySummaryNode (1 spans)
-   instrumented: generateMonthlySummary (1 spans)

## Advisory Findings
- CDQ-007 (Attribute Data Quality):556: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):730: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):814: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
