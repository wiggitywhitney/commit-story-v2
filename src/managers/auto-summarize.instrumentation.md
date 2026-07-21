# Instrumentation Report: src/managers/auto-summarize.js

## Summary
- **Status**: success
- **Spans added**: 3
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 3.5K
- **Output tokens**: 7.8K

## Schema Extensions
- `span.commit_story.summary.trigger_auto_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`
- `span.commit_story.summary.trigger_auto_monthly_summaries`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- The schema defines span names commit_story.summary.run_summarize, commit_story.summary.run_weekly_summarize, and commit_story.summary.run_monthly_summarize that would match these three functions, but all three are already declared as in-use by earlier files in this run. New unique names were invented: trigger_auto_summaries, trigger_auto_weekly_summaries, trigger_auto_monthly_summaries (SCH-001: schema names must not be reused for different operations).
- getErrorMessage is a pure synchronous helper with no I/O and is unexported — skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported internals covered by their orchestrator spans).
- The inner catch blocks inside the for loops in all three functions accumulate errors into result.failed/result.errors arrays and do not rethrow — these are graceful-degradation catches representing expected failures (individual summary generation errors). Per NDS-007, recordException and setStatus(ERROR) were not added to these inner catches. The outer span-level catch still records unexpected errors that escape the loop.
- All attributes set (commit_story.summary.base_path, commit_story.summary.dates_count, commit_story.summary.weeks_count, commit_story.summary.months_count, commit_story.summary.generated_count, commit_story.summary.failed_count) are already registered in the schema — no new attribute extensions needed.
- In triggerAutoSummaries, generated_count and failed_count are set on both the early-return path (when daily failures prevent weekly/monthly runs) and the final combined-result path, ensuring the span carries outcome data regardless of which path executes.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):26: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):30: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):119: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):123: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):183: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):187: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and instrument it according to the schema and rules.

Three exported async functions need spans:
1. `triggerAutoSummaries` → schema span: `commit_story.summary.run_summarize` — wait, that's already in use. Let me check the "already in use" list... `commit_story.summary.run_summarize` IS in the list. So I need to invent new names.

Wait, let me re-read. The schema has these span IDs:
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`  
- `span.commit_story.summary.run_monthly_summarize`

And all three are already taken. So for `triggerAutoSummaries`, `triggerAutoWeeklySummaries`, and `triggerAutoMonthlySummaries`, I need to create new span names that don't conflict with the existing ones.

I'll use `commit_story.summary.trigger_auto_summaries`, `commit_story.summary.trigger_auto_weekly_summaries`, and `commit_story.summary.trigger_auto_monthly_summaries` as new schema extensions. Now I'm mapping out the attributes I need to capture—`base_path`, the count of generated and failed summaries, and the count of unsummarized dates. Finishing the monthly summaries mapping, then reconsidering the CDQ-006 guard requirement — since `.length` is a direct property access and `basePath` is just a variable read, neither needs guarding. The catch blocks in the loops are capturing errors from the summary generation functions and adding them to the failed results array.

Writing the function implementation... Setting span attributes before each return path... I can compute the combined totals by adding up the lengths from each result object before the return statement, which avoids needing to extract the object literal itself. Since I'm just doing property access and arithmetic operations, there's no need for additional guards.

For the early exit path, I'll add the same setAttribute calls before returning the single result object. Now I'm mapping out the instrumentation points for both functions: `triggerAutoWeeklySummaries` needs the base path, weeks count, and final generated/failed counts, while `triggerAutoMonthlySummaries` follows the same pattern with months count instead.

Checking the schema — all the attribute keys I'm using are already registered, so I only need to add the three new span names for the trigger functions themselves. Writing the instrumented function... Handling partial generation results and errors...

If daily summaries failed, I'm skipping the higher-cadence rollups to avoid locking in incomplete data, then setting the telemetry attributes and returning early. Otherwise, I'm triggering the weekly and monthly summary generation in sequence and accumulating their results. The inner try/catch handles expected errors correctly by collecting failed summaries without rethrowing, which aligns with the error handling pattern. Now I need to apply the same structure to the weekly and monthly summary functions, setting the appropriate span attributes at each stage—base path at the start, count metrics after finding unsummarized periods, and generated/failed counts before returning. The schema names are already taken by other files, so I'm creating new span names instead. My final counts are three service entry points, zero external calls, zero schema-defined spans since I had to invent new names, and four total functions in the file. I'm also defining the three new schema extensions for these trigger functions and confirming that no new attributes need to be created.

Now I need to generate the complete instrumented file as a JSON string.
```
