# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 26.1K
- **Output tokens**: 17.6K

## Schema Extensions
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_weekly`
- `span.commit_story.summarize.run_monthly`
- `commit_story.summarize.dates_count`
- `commit_story.summarize.force`
- `commit_story.summarize.monthly_summaries_generated`

## Validation Journey
1. **Attempt 1**: 4 blocking errors (SCH-002 (Attribute Keys Match Registry):4)
2. **Attempt 2**: 0 errors

## Notes
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, showSummarizeHelp are all pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- commit_story.summarize.dates_count is reused across all three entry points (runSummarize, runWeeklySummarize, runMonthlySummarize) to capture the count of items (dates, weeks, or months) submitted to the run. The validator confirmed weeks_count and months_count are semantic duplicates of dates_count — the same concept (input item count) applies across all three modes.
- commit_story.summarize.force: no registered boolean flag key exists in the registry. New key declared to capture the --force CLI flag value.
- commit_story.summarize.monthly_summaries_generated: no registered key captures count of monthly summaries successfully generated. commit_story.journal.daily_summaries_count and commit_story.journal.weekly_summaries_count exist for their respective tiers but there is no monthly equivalent in the registry. New key declared.
- The per-item try/catch blocks inside the for loops in all three entry-point functions catch errors gracefully without rethrowing. NDS-007 applies — recordException and setStatus(ERROR) were not added to those catches. The outer span-level catch handles any unexpected error that escapes the loop body.
- The empty inner catch block for access(summaryPath) in runSummarize is an expected-condition catch (ENOENT means file not found, proceed with generation). NDS-007 applies — no error recording added.
- CDQ-007 advisory addressed: dates, weeks, and months are guarded with `!= null` before accessing .length.
