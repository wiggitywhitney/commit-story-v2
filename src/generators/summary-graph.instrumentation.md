# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 50.0K
- **Output tokens**: 59.0K
- **Cached tokens**: 39.5K

## Schema Extensions
- `span.commit_story.journal.daily_summary`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.weekly_summary`
- `commit_story.journal.daily_summaries_count`
- `span.commit_story.journal.create_weekly_summary`
- `commit_story.journal.week_label`
- `span.commit_story.journal.monthly_summary`
- `commit_story.journal.weekly_summaries_count`
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
1. **Attempt 1**: 47 blocking errors (NDS-003 (Code Preserved):42, SCH-002 (Attribute Keys Match Registry):5)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: function-level: 12/12 functions instrumented

## Notes
- Replaced all uses of commit_story.summary.summaries_count with commit_story.summary.entries_count after the validator identified them as semantic duplicates (SCH-002). The registered attribute commit_story.summary.entries_count now serves double duty: it captures the count of journal entries in daily summary spans and the count of daily/weekly summaries being consolidated in weekly/monthly spans. The semantic overlap is close enough that a single attribute key is appropriate.
- Restored multi-line format for BANNED_WORD_REPLACEMENTS entries — the actual file on disk uses 3-4 line format for the comprehensiv, systematic, leverag, enhancements, and utiliz entries (each with the array bracket, regex, and handler function on separate lines). The source provided in the prompt had these collapsed to single lines, causing NDS-003 line-format violations in the previous output.
- Restored multi-line format for parseMonthlySummarySections — the sections object initialization is split across multiple lines (one property per line), and the guard condition is split across 6 lines with each boolean operand on its own line. These were collapsed in the previous output causing NDS-003 failures.
- The inner try/catch blocks inside the *Node functions catch LLM call failures and return graceful fallbacks without rethrowing — no recordException or setStatus(ERROR) was added to them per NDS-007. The outer span-level catch handles unexpected errors outside the inner try scope.
- SCH-001 advisory notes that the generate_* span names may be semantic duplicates of the *_node spans — they are different operation classes: the *_node spans represent the LangGraph node execution (the LLM call), while generate_* spans represent the public API entry point that invokes the full graph pipeline including graph compilation and result post-processing.
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
- CDQ-007 (Attribute Data Quality):211: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):521: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):774: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
