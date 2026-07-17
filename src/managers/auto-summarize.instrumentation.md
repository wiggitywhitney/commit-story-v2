# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.3K
- **Output tokens**: 8.0K

## Schema Extensions
- `span.commit_story.managers.trigger_auto_summaries`
- `span.commit_story.managers.trigger_auto_weekly_summaries`
- `span.commit_story.managers.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getErrorMessage is a synchronous, unexported pure helper with no I/O — skipped per RST-001 and RST-004.
- triggerAutoSummaries, triggerAutoWeeklySummaries, and triggerAutoMonthlySummaries are all COV-001 entry points — each receives its own span.
- All three span names are new schema extensions under the 'commit_story.managers' category. The schema defines span names for commands (run_summarize, run_weekly_summarize, run_monthly_summarize) and journal operations, but no spans exist for the auto-trigger manager layer. The 'managers' category was chosen to reflect the file's role as an orchestration manager distinct from the command layer.
- commit_story.journal.base_path is a registered attribute used for the basePath input parameter on all three spans.
- commit_story.summarize.dates_count is a registered attribute used in triggerAutoSummaries for the count of unsummarized days returned by findUnsummarizedDays.
- commit_story.journal.unsummarized_weeks_count is a registered attribute used in triggerAutoWeeklySummaries for the count of unsummarized weeks.
- commit_story.journal.unsummarized_months_count is a registered attribute used in triggerAutoMonthlySummaries for the count of unsummarized months.
- commit_story.summarize.failed_count is a registered attribute used on all three spans to record how many items failed during the run. In triggerAutoSummaries, two setAttribute calls cover both the early-return path (daily failures only) and the final-return path (sum across daily, weekly, and monthly).
- Inner catch blocks inside the for loops in each function do not rethrow — they push to result.failed and continue. Per NDS-007, recordException and setStatus(ERROR) are not added to these graceful-degradation catches. Only the outer span-level catch records errors.
- All setAttribute calls in COV-001 entry points are exempt from CDQ-006 isRecording() guards per the COV-001 exemption rule.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):26: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):30: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):117: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):121: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):180: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):184: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and instrument it according to the schema and rules.

The file has three exported async functions that need spans:
1. `triggerAutoSummaries` - COV-001 entry point
2. `triggerAutoWeeklySummaries` - COV-001 entry point
3. `triggerAutoMonthlySummaries` - COV-001 entry point

`getErrorMessage` is synchronous, unexported, and a pure helper - skip per RST-001/RST-004.

For span names, I need to check the schema. Looking at the schema spans:
- `span.commit_story.commands.run_summarize` - already used
- `span.commit_story.commands.run_weekly_summarize` - already used
- `span.commit_story.commands.run_monthly_summarize` - already used

These are "auto-summarize" operations, so I need to invent names since the schema doesn't have specific ones for these functions. The namespace is `commit_story`. I'll use `commit_story.managers.trigger_auto_summaries`, `commit_story.managers.trigger_auto_weekly_summaries`, and `commit_story.managers.trigger_auto_monthly_summaries` for the three functions.

Now I'm mapping the attributes for each trigger function. For `triggerAutoSummaries`, the input is the base path and the results include generated, skipped, and failed counts—I can use `commit_story.summarize.dates_count` for unsummarized days found and `commit_story.summarize.failed_count` for failures. For `triggerAutoWeeklySummaries`, I'm starting with the base path attribute again. I need to figure out which registered attribute key works best for tracking generated summaries—`commit_story.summarize.dates_count` seems like the right fit for counting the unsummarized days being processed, while `commit_story.summarize.failed_count` handles the failures. For the generated count itself, I might need to declare a new extension key since there's no exact registered match.

Now I'm setting up the span attributes carefully—I need to remember that direct property accesses like `result.generated.length` and `unsummarizedDays.length` don't require guards, and I should set these attributes at the end of the try block before the span closes.

Writing the span setup... I'm realizing the tricky part is that `result` is scoped inside the try block, so I can't access it in the finally block to set the failed_count attribute. I'll need to set that attribute right before the early return statement instead, or declare result outside the try block so it's accessible in finally. I need to place the setAttribute calls before each return statement since the final return uses an object literal. For `triggerAutoSummaries`, I'll set the base path at the start, the dates count after getting unsummarized days, and the failed count before both the early return and the final return—capturing the total failures across all results.

For the weekly and monthly functions, I should also track the unsummarized weeks and months counts alongside the failed counts before their respective returns. For the final return, I need to set the failed count to the total across all three result objects, which means adding up the failed arrays from the regular, weekly, and monthly summaries. I'll set the attribute right before each return statement with the appropriate count available at that point.

Now I'm identifying the schema extensions needed for the span names that trigger auto-summaries at different intervals, and reviewing which attributes are already registered versus which ones I still need to declare. Writing instrumented code... Writing the function body... Checking the CDQ-006 rule more carefully — it specifies guards are needed for function calls, method calls, array transformations, or string joining, but arithmetic operations aren't explicitly listed, so the setAttribute call for the failed count doesn't need wrapping. The logic looks right: I'm setting the count to the individual result length in the early return, then computing the total across all three result sets in the final return.

Now I'm going to write out the full instrumented file, being careful to preserve the original code structure and whitespace exactly. I need to place the setAttribute calls strategically — starting with `commit_story.journal.base_path` at the beginning, then `dates_count` after getting the unsummarized days, and similar patterns for the weekly and monthly summary functions. Writing the instrumentation code...
```
