# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 46.0K
- **Output tokens**: 72.5K
- **Cached tokens**: 40.4K

## Schema Extensions
- `span.commit_story.ai.generate_daily_summary`
- `commit_story.journal.entries_count`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.journal.generate_weekly_summary`
- `commit_story.journal.week_label`
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
1. **Attempt 1**: 42 blocking errors (NDS-003 (Code Preserved):42)
2. **Attempt 2**: 3 blocking errors (NDS-003 (Code Preserved):3)
3. **Attempt 3**: function-level: 12/12 functions instrumented

## Notes
- Moved node span names from commit_story.ai.* to commit_story.summary.* to resolve SCH-001 advisory — the per-period summary nodes (daily/weekly/monthly) are a different operation class from the per-commit commit_story.ai.generate_summary span defined in the registry, so new names were warranted rather than reuse.
- The inner catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode all return a fallback value without rethrowing — per NDS-007 these are graceful-degradation catches and do not receive recordException/setStatus. The outer span wrapper's own catch handles unexpected exceptions that bypass those inner handlers.
- commit_story.summary.week_label and commit_story.summary.month_label are invented because no registered attribute captures ISO week (e.g. '2026-W09') or month (e.g. '2026-02') period identifiers. The closest registered keys — commit_story.journal.entry_date and commit_story.context.time_window_start — capture calendar dates and ISO 8601 instants, not period labels.
- Six of 23 functions (~26%) receive spans, slightly above the 20% backstop. All six are required by COV-001 (exported async entry points), so none can be dropped. The remaining 17 are synchronous utilities, unexported helpers, or single-line accessors excluded by RST-001/RST-004.
- BANNED_WORD_REPLACEMENTS array entries were restored to their original multi-line format (4-line tuples for comprehensiv, systematic, leverag, enhancements, and utiliz entries) which the source provided to the agent had incorrectly collapsed to single lines. Similarly parseMonthlySummarySections const sections and its if condition were restored to their original multi-line forms.
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
- CDQ-007 (Attribute Data Quality):210: CDQ-007: setAttribute value "entries.length" at line 210 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality):283: CDQ-007: setAttribute value "entries.length" at line 283 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality):436: CDQ-007: setAttribute value "dailySummaries.length" at line 436 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality):512: CDQ-007: setAttribute value "dailySummaries.length" at line 512 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality):685: CDQ-007: setAttribute value "weeklySummaries.length" at line 685 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).
- CDQ-007 (Attribute Data Quality):765: CDQ-007: setAttribute value "weeklySummaries.length" at line 765 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).
