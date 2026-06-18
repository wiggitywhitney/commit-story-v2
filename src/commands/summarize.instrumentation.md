# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 31.7K
- **Output tokens**: 22.2K

## Schema Extensions
- `span.commit_story.commands.run_summarize`
- `span.commit_story.commands.run_weekly_summarize`
- `span.commit_story.commands.run_monthly_summarize`
- `commit_story.commands.dates_count`
- `commit_story.commands.force`

## Validation Journey
1. **Attempt 1**: 12 blocking errors (SCH-002 (Attribute Keys Match Registry):12)
2. **Attempt 2**: 0 errors

## Notes
- isValidDate (unexported), isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, and showSummarizeHelp are all synchronous functions with no async I/O — skipped per RST-001 (no spans on synchronous utilities).
- The three inner catch(err) blocks inside runSummarize, runWeeklySummarize, and runMonthlySummarize handle per-item failures gracefully by pushing to result arrays without rethrowing. NDS-007 applies — no recordException or setStatus added to these catches. Only the outer span-level catch gets full error recording per COV-003.
- The inner catch{} block for access(summaryPath) in runSummarize is an empty graceful-degradation catch (file not found = proceed with generation). NDS-007 applies — no error recording added.
- The validator rejected commit_story.commands.generated_count, commit_story.commands.failed_count, commit_story.commands.weeks_count, and commit_story.commands.months_count as semantic duplicates of commit_story.commands.dates_count. Per the validator's directive, commit_story.commands.dates_count is reused for the input item count in all three command functions (dates, weeks, months all represent the count of items the command was asked to process). The output result counts (generated, failed) were dropped since no valid registered key covers per-run outcome counts and the validator will not accept new extensions in this category.
- CDQ-007 advisories resolved: guarded dates, weeks, and months with != null checks before accessing .length, using the pattern `x != null ? x.length : 0` to protect against null or undefined inputs from callers.
- SCH-001 advisories about run_weekly_summarize and run_monthly_summarize being potential duplicates of run_summarize are informational only — these are distinct operations (weekly and monthly aggregation vs. daily generation) and warrant separate span names for independent observability.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
