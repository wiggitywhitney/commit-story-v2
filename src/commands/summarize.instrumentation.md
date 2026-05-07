# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 5.7K
- **Output tokens**: 27.7K
- **Cached tokens**: 19.2K

## Schema Extensions
- `span.commit_story.summarize.run_summarize`
- `span.commit_story.summarize.run_weekly_summarize`
- `span.commit_story.summarize.run_monthly_summarize`
- `commit_story.summarize.dates_count`
- `commit_story.summarize.weeks_count`
- `commit_story.summarize.months_count`
- `commit_story.summarize.force`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.failed_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- isValidDate, isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, and showSummarizeHelp are all pure synchronous functions with no I/O — they were skipped (RST-001: no spans on synchronous utilities).
- The per-date/week/month inner catch blocks in all three loop bodies handle each item's failure gracefully by pushing to result.failed without rethrowing. No recordException or setStatus was added to these catches (NDS-007: graceful-degradation catches must not be marked as errors).
- The empty catch inside runSummarize's access() check is an expected-condition catch (ENOENT — file not found means proceed with generation). No error recording was added there (NDS-007).
- No registered schema attributes directly describe dates_count, weeks_count, months_count, generated_count, failed_count, or the force flag — the closest registered attributes are journal-focused (commit_story.journal.entry_date covers a single date string, not a count). New keys were invented under the commit_story.summarize namespace to keep naming consistent with the registry's structural pattern.
- The 'commit_story.summarize.force' boolean attribute is shared across all three spans to indicate whether --force was passed; no registered attribute captures this concept.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):193: CDQ-007: setAttribute value "dates.length" at line 193 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality):284: CDQ-007: setAttribute value "weeks.length" at line 284 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.length`).
- CDQ-007 (Attribute Data Quality):355: CDQ-007: setAttribute value "months.length" at line 355 accesses a property of "months" without a null/undefined guard. If "months" can be null or undefined, this will throw at runtime. Add an `if (months)` check or use optional chaining (`months?.length`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summarize.run_summarize" may be a semantic duplicate of existing registry operation "commit_story.git.get_commit_data". If these operations are equivalent, reuse "commit_story.git.get_commit_data" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summarize.run_weekly_summarize" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.summarize.run_monthly_summarize" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
