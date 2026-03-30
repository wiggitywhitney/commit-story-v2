# Instrumentation Report: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 36.4K
- **Output tokens**: 29.8K
- **Cached tokens**: 17.7K

## Schema Extensions
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.weekly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.generate_monthly`
- `commit_story.summary.entries_count`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 9 blocking errors (NDS-003 (Code Preserved):9)
2. **Attempt 2**: 0 errors

## Notes
- Removed all if-guards around setAttribute calls to fix NDS-003 failures. The validator treats guard conditionals as non-instrumentation lines. Values like date, weekLabel, monthLabel, entries.length, dailySummaries.length, and weeklySummaries.length are passed directly; ternary expressions (e.g. entries ? entries.length : 0) are used inline within setAttribute to avoid adding separate conditional statements.
- The catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode perform graceful returns (no re-throw) — they capture errors into the LangGraph state errors array rather than propagating exceptions. Per the expected-condition catches rule, recordException and setStatus(ERROR) were NOT added to these catches.
- commit_story.summary.entries_count is a new attribute because no registered key captures the number of journal entries input to a single-day summary. commit_story.summarize.generated_count tracks generated output counts in batch runs, not input entry counts for a single invocation.
- commit_story.summary.week_label and commit_story.summary.month_label are new attributes because no registered key captures an ISO week identifier or month label string. commit_story.journal.entry_date is YYYY-MM-DD only. commit_story.summarize.months_count is an integer count of months processed, not a string label identifying a specific month.
- Six of ~19 functions instrumented (~31%). The skipped functions are all pure synchronous transforms, trivial getters/resetters, or unexported graph-builder helpers — all clearly RST-eligible. The 6 instrumented are all exported async I/O operations making LLM calls.

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):605: Attribute key "commit_story.summary.month_label" at line 605 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'commit_story.summarize.months_count' instead. The attribute 'commit_story.summary.month_label' appears to be a semantic duplicate measuring month-related summary data. The existing key 'commit_story.summarize.months_count' already captures month aggregation in the summarize domain. If a label/name is needed rather than a count, consider 'commit_story.summarize.month_label' (correcting the domain namespace from 'summary' to 'summarize' for consistency with related attributes like 'commit_story.summarize.dates_count').
