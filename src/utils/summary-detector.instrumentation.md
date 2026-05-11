# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.4K
- **Output tokens**: 17.9K

## Schema Extensions
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`
- `span.commit_story.journal.find_unsummarized_months`
- `commit_story.journal.months_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString and getNowDate are unexported, synchronous helpers with no I/O — skipped per RST-001 (no spans on pure synchronous utilities) and RST-004 (unexported functions not covered by exported orchestrators do not need spans when the work is synchronous).
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported but were explicitly flagged in the pre-instrumentation analysis for COV-004 coverage. Each performs async filesystem I/O (readdir) that benefits from individual span visibility when debugging gap-detection logic.
- The schema defines span IDs commit_story.journal.read_day_entries, commit_story.journal.read_week_daily_summaries, and commit_story.journal.read_month_weekly_summaries that are semantically close to operations in this file, but all three were listed as already in use by earlier files in this run. Unique new names (get_days_with_entries, get_days_with_daily_summaries, get_weeks_with_weekly_summaries) were invented to avoid collision.
- commit_story.journal.months_count is a new attribute (schemaExtension). The schema registers commit_story.journal.weeks_count (int) and commit_story.journal.entries_count (int) as parallel count attributes but has no equivalent for months. The new key follows the same commit_story.journal.*_count naming convention and int type.
- Inner readdir try/catch blocks that return empty collections ([], new Set()) on ENOENT-style failures are graceful-degradation catches — span.recordException and setStatus(ERROR) were not added to those catches per NDS-007. Each outer span wrapper has its own catch for unexpected errors that bypass these inner handlers.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):94: CDQ-007: setAttribute value "dates.length" at line 94 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality):130: CDQ-007: setAttribute value "dates.size" at line 130 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.size`).
- CDQ-007 (Attribute Data Quality):167: CDQ-007: setAttribute value "result.length" at line 167 accesses a property of "result" without a null/undefined guard. If "result" can be null or undefined, this will throw at runtime. Add an `if (result)` check or use optional chaining (`result?.length`).
- CDQ-007 (Attribute Data Quality):203: CDQ-007: setAttribute value "weeks.size" at line 203 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.size`).
- CDQ-007 (Attribute Data Quality):240: CDQ-007: setAttribute value "dates.length" at line 240 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality):290: CDQ-007: setAttribute value "unsummarized.length" at line 290 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- CDQ-007 (Attribute Data Quality):326: CDQ-007: setAttribute value "months.size" at line 326 accesses a property of "months" without a null/undefined guard. If "months" can be null or undefined, this will throw at runtime. Add an `if (months)` check or use optional chaining (`months?.size`).
- CDQ-007 (Attribute Data Quality):363: CDQ-007: setAttribute value "weeks.length" at line 363 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.length`).
- CDQ-007 (Attribute Data Quality):425: CDQ-007: setAttribute value "unsummarized.length" at line 425 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.get_summarized_days" may be a semantic duplicate of existing registry operation "commit_story.journal.generate_daily_summary". If these operations are equivalent, reuse "commit_story.journal.generate_daily_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.find_unsummarized_days" may be a semantic duplicate of existing registry operation "commit_story.journal.get_days_with_entries". If these operations are equivalent, reuse "commit_story.journal.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.get_summarized_weeks" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.get_days_with_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_days". If these operations are equivalent, reuse "commit_story.journal.get_summarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.find_unsummarized_weeks" may be a semantic duplicate of existing registry operation "commit_story.journal.find_unsummarized_days". If these operations are equivalent, reuse "commit_story.journal.find_unsummarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.get_summarized_months" may be a semantic duplicate of existing registry operation "commit_story.journal.read_month_weekly_summaries". If these operations are equivalent, reuse "commit_story.journal.read_month_weekly_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.get_weeks_with_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_weeks". If these operations are equivalent, reuse "commit_story.journal.get_summarized_weeks" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): SCH-001: declared span extension "commit_story.journal.find_unsummarized_months" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_months". If these operations are equivalent, reuse "commit_story.journal.get_summarized_months" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
