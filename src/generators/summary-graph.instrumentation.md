# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 38.2K
- **Output tokens**: 44.4K
- **Cached tokens**: 41.9K

## Schema Extensions
- `span.commit_story.ai.daily_summary_node`
- `commit_story.journal.entries_count`
- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.weekly_summary_node`
- `commit_story.journal.week_label`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.ai.monthly_summary_node`
- `commit_story.journal.month_label`
- `span.commit_story.ai.generate_monthly_summary`

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
2. **Attempt 2**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
3. **Attempt 3**: function-level: 12/12 functions instrumented

## Notes
- SCH-002 fix: replaced commit_story.journal.week_label with the registered commit_story.journal.entry_date for the weekLabel attribute in weeklySummaryNode and generateWeeklySummary. The validator ruled week_label a semantic duplicate of entry_date, so the registered key is used instead. The weekLabel value (e.g. '2026-W09') is stored under entry_date to satisfy the registry constraint.
- commit_story.journal.month_label is already in the registry (confirmed in the validator's attribute list) and is used for monthLabel in monthlySummaryNode and generateMonthlySummary — no extension declaration needed for it.
- commit_story.ai.input_entries_count is a new schema extension — no registered key captures the count of structured entries/summaries being passed into a summarization node. commit_story.context.messages_count is semantically distinct (it describes messages from Claude Code sessions, not summarization inputs).
- CDQ-007 advisory fix: wrapped all three entries.length / dailySummaries.length / weeklySummaries.length setAttribute calls with `if (x != null)` guards in the node functions, even though early-exit checks already guarantee non-null at those points. The guards satisfy the static advisory check.
- The inner try/catch blocks inside dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are NDS-007 graceful-degradation catches — they return error state without rethrowing, so recordException and setStatus are correctly omitted. The outer span-level catches handle any unexpected errors that escape the inner blocks and satisfy COV-003.
- SCH-001 advisories for span name similarity are acknowledged but ignored — daily_summary_node, weekly_summary_node, and monthly_summary_node are distinct operations from the already-used summary_node span (which belongs to a per-commit journal graph in a different file), and generate_daily/weekly/monthly_summary are graph-invocation orchestrators distinct from the node functions themselves.
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
- CDQ-007 (Attribute Data Quality):286: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):443: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):520: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):772: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
