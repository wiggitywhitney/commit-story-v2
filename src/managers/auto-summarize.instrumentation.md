# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 23.2K
- **Output tokens**: 15.6K
- **Cached tokens**: 74.4K

## Schema Extensions
- `span.commit_story.summarize.trigger_auto`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`

## Validation Journey
1. **Attempt 1**: 2 blocking errors (SCH-002 (Attribute Keys Match Registry):2)
2. **Attempt 2**: 7 blocking errors (SCH-002 (Attribute Keys Match Registry):7)
3. **Attempt 3**: 0 errors

## Notes
- triggerAutoSummaries, triggerAutoWeeklySummaries and triggerAutoMonthlySummaries are exported async orchestrators that auto-generate summaries after journal entry creation, so each gets its own span (COV-001: entry points need spans). New span names commit_story.summarize.trigger_auto / trigger_auto_weekly / trigger_auto_monthly were invented because the schema's commit_story.summarize.run_* names are already used by other files for different operations (the manual summarize commands).
- getErrorMessage is a synchronous, unexported helper that formats error messages — no span (RST-001: no spans on pure synchronous helpers).
- The per-item try/catch blocks inside each loop swallow failures and record them in the result object without rethrowing, so no recordException/setStatus was added to them (NDS-007: graceful-degradation catches are not span errors). Only the outer span-level catch records errors.
- To avoid the previous SCH-002 semantic-duplicate rejection, no new attribute extensions were declared; only registered keys are used: commit_story.summarize.dates_count (number of unsummarized days found), commit_story.journal.daily_summaries_count and commit_story.journal.weekly_summaries_count (number of daily/weekly summaries generated), and commit_story.journal.errors_count (number of errors collected).
- triggerAutoMonthlySummaries carries only commit_story.journal.errors_count because no registered key describes a count of months or monthly summaries, and inventing one risked a semantic-duplicate rejection.
- In triggerAutoSummaries, errors_count is set before the early return when daily failures occurred, and on the success path it is set to the combined daily+weekly+monthly error total. The final return is an object literal, so it was not captured into a variable; the attributes are set beforehand instead.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):29: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
I need to instrument the three trigger functions for daily, weekly, and monthly auto-summarization with unique span names, declaring them as extensions, and track attributes like the count of unsummarized dates and error counts on the results.

For aggregating totals in `triggerAutoSummaries`, since the final return is an inline object I can't capture directly, I'll set span attributes before the early return and compute combined totals from the daily, weekly, and monthly results after their respective calls complete. I'm also considering how inner catch blocks should handle errors gracefully.

Now I'm writing the instrumented code, carefully adjusting indentation while preserving the structure.


```

### Attempt 2

```
I need to fix the duplicate key issue—months_count is flagging as a duplicate of weeks_count. Maybe I should use a shared naming convention like a generic periods_count key for both weekly and monthly cases, though that risks the same duplication problem if weeks_count is already registered under a similar concept.

Given blocking failures take priority, I'll just drop months_count entirely rather than risk another flag, keeping the monthly span's other attributes like generated_count, and add null guards to handle the gap safely.


```

### Attempt 3

```
I need to instrument three functions with new span names for daily, weekly, and monthly auto-trigger summaries, and I'm working out which existing attribute keys to reuse for counts rather than inventing new ones.

For the weekly and daily functions, weekly_summaries_count/daily_summaries_count and errors_count seem like solid fits for generated/error counts. For the monthly function, though, there's no clean registered key for a month count—using dates_count feels semantically off and a new months_count key risks the same duplicate-extension flag as before, so I'll stick to errors_count there and avoid adding a path-based key since basePath isn't a registered identifier.

For triggerAutoSummaries, I'm setting dates_count from the unsummarized days after awaiting, daily_summaries_count from the generated results, and aggregating errors_count across daily, weekly, and monthly results before the final object literal return—since that return can't be instrumented directly, attributes need to be set beforehand. This entry point doesn't need CDQ-006 computation guards, and the inner try/catch blocks stay untouched since they're just graceful error handling, not places that need recording.


```
