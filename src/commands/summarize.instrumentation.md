# Instrumentation Report: src/commands/summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.1K
- **Output tokens**: 14.8K
- **Cached tokens**: 28.3K

## Schema Extensions
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `span.commit_story.summary.run_monthly_summarize`
- `commit_story.summary.dates_count`
- `commit_story.summary.force`
- `commit_story.summary.generated_count`
- `commit_story.summary.failed_count`
- `commit_story.summary.weeks_count`
- `commit_story.summary.months_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- isValidDate (unexported, sync) — pure date-string validation with no I/O, skipped per RST-001 and RST-004.
- isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs, showSummarizeHelp — all synchronous with no I/O, skipped per RST-001.
- runSummarize inner try/catch (access ENOENT check): the empty catch swallows the expected file-not-found condition as a control-flow signal; no recordException or setStatus added per NDS-007.
- runSummarize outer per-date catch: pushes to result.failed without rethrowing — graceful degradation, no error recording added per NDS-007. The span-level catch handles any unexpected errors escaping the full function body.
- runWeeklySummarize and runMonthlySummarize per-item catch blocks: similarly graceful (no rethrow), so no error recording added per NDS-007.
- commit_story.summary.dates_count: no registered key counts input dates to process — closest match commit_story.summary.entries_count describes journal entries, not date arguments; declared as new int attribute.
- commit_story.summary.force: no registered key captures the force-regeneration flag; declared as new boolean attribute used across all three entry points.
- commit_story.summary.generated_count: no registered key counts successfully generated summaries in a batch run — commit_story.summary.entries_count describes journal entries, not generated output summaries; declared as new int attribute.
- commit_story.summary.failed_count: no registered key counts failed summary generation attempts in a batch; declared as new int attribute.
- commit_story.summary.weeks_count: no registered key counts input ISO-week strings — commit_story.summary.week_label is for a single label value, not a count; declared as new int attribute.
- commit_story.summary.months_count: no registered key counts input month strings — commit_story.summary.month_label is for a single label value, not a count; declared as new int attribute.
- All async sub-operations (readDayEntries, generateAndSaveDailySummary, generateAndSaveWeeklySummary, generateAndSaveMonthlySummary) are already instrumented in summary-manager.js with their own spans; no duplicate manual spans added here per RST-005 guidance and the pre-instrumentation analysis.

## Advisory Findings
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze the file and determine what needs to be instrumented.

**Functions to instrument:**
1. `runSummarize` (line 186) - COV-001 entry point, exported async
2. `runWeeklySummarize` (line 261) - COV-001 entry point, exported async
3. `runMonthlySummarize` (line 316) - COV-001 entry point, exported async

**Functions to skip:**
- `isValidDate` - sync, RST-001
- `isValidWeekString` - sync, RST-001
- `isValidMonthString` - sync, RST-001
- `expandDateRange` - sync, RST-001
- `parseSummarizeArgs` - sync, RST-001
- `showSummarizeHelp` - sync, RST-001

Now I'm checking the schema for available span names. The existing spans like `commit_story.summary.daily_node`, `commit_story.summary.weekly_node`, and `commit_story.summary.monthly_node` are already in use, so I need to find appropriate names for the three entry points I'm instrumenting. Now I'm defining the attributes for each span. For `runSummarize`, I need to track the input dates count and force flag, which don't have existing registered keys, so I'll create `commit_story.summary.dates_count` as an integer and `commit_story.summary.force` as a boolean. For the results, I can reuse `commit_story.summary.entries_count` for the generated count, though I should verify if that's the right fit or if I need additional attributes for failed and other result metrics. I'm realizing that `week_label` and `month_label` are already defined in the schema for single periods, so they might not be ideal for tracking multiple weeks or months. I need to create new attributes like `weeks_count` and `months_count` to represent the number of periods being summarized, while being careful not to reuse existing keys like `entries_count` for different semantic purposes. The inner catch blocks handle per-item errors gracefully without rethrowing, so they shouldn't record exceptions per NDS-007. The outer span catch would handle unexpected errors that escape the loop. I need to wrap the entire function body with the span, keeping the existing try/catch blocks intact inside it.

Writing instrumented code... Adding schema attributes and span names... Adding instrumentation attributes... Writing instrumentation code... Writing the instrumented function... Now I'm reviewing the span attributes being tracked across the different summarize functions to make sure I'm capturing all the metrics consistently—there are six unique attribute types total, with some being reused across multiple spans. Preserving the original code exactly...
```
