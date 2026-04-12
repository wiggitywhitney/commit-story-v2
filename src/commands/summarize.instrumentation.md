# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.6K
- **Output tokens**: 8.4K

## Schema Extensions
- `span.commit_story.summarize.run_summarize`
- `span.commit_story.summarize.run_weekly_summarize`
- `span.commit_story.summarize.run_monthly_summarize`
- `commit_story.summarize.date_count`
- `commit_story.summarize.week_count`
- `commit_story.summarize.month_count`
- `commit_story.summarize.force`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Inner per-date/week/month catch blocks in runSummarize, runWeeklySummarize, and runMonthlySummarize collect errors into result.failed/errors without rethrowing — these are expected-condition catches representing graceful degradation, not unhandled failures. No recordException/setStatus was added to them. The outer span-level catch handles any unexpected error escaping the loop.
- The empty catch block inside runSummarize for the access() call (checking if a summary file already exists) is also an expected-condition catch (ENOENT) and was left without OTel error recording per the expected-condition rule.
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, and showSummarizeHelp were all skipped: they are synchronous pure functions or trivial output helpers with no I/O (RST-001).
- New attribute keys were invented under commit_story.summarize.* because no registered schema key captured input counts (date_count, week_count, month_count), force flag, or result outcome counts (generated_count, failed_count). The closest registered keys (commit_story.journal.word_count, commit_story.filter.messages_after) are semantically unrelated to summarize command operation metadata.
- commit_story.summarize.force was set as a boolean directly via setAttribute — OTel accepts boolean primitives. basePath was intentionally excluded from attributes per CDQ-007 (raw filesystem path).

## Advisory Findings
- SCH-004 (No Redundant Schema Entries):193: Attribute key "commit_story.summarize.date_count" at line 193 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'commit_story.summarize.input_count' or 'commit_story.summarize.item_count' instead, as 'date_count' is semantically redundant with the temporal context already captured by 'commit_story.context.time_window_start' and 'commit_story.context.time_window_end'. If the intent is to track date-formatted items in the summarization, consider 'commit_story.summarize.dates_processed' for clarity, or align with the pattern used in 'commit_story.journal.quotes_count' and 'commit_story.journal.word_count' by using 'commit_story.summarize.dates_referenced'.
- SCH-004 (No Redundant Schema Entries):194: Attribute key "commit_story.summarize.force" at line 194 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'gen_ai.request.max_tokens' instead. The attribute 'commit_story.summarize.force' appears to control token limits for the summarization operation, which semantically aligns with the gen_ai semantic convention for maximum token constraints, even though it is in the commit_story domain.
- SCH-004 (No Redundant Schema Entries):261: Attribute key "commit_story.summarize.failed_count" at line 261 appears to be a semantic duplicate of an existing registry entry (judge confidence: 78%). Use 'commit_story.summarize.error_count' or add a registered key 'commit_story.summarize.error_count' to the registry. The term 'failed_count' is imprecise in telemetry; use 'error_count' to align with semantic convention naming patterns for error/failure metrics.
