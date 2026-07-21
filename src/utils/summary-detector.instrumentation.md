# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 16.1K

## Schema Extensions
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.get_summarized_days`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.get_summarized_weeks`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.get_summarized_months`
- `span.commit_story.summary.get_weeks_with_weekly_summaries`
- `span.commit_story.summary.find_unsummarized_months`
- `commit_story.summary.base_path`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- commit_story.summary.base_path is a new extension key capturing the journal root directory passed to every function in this file. No registered key semantically matches a filesystem base path for journal operations. CDQ-007 cautions about raw filesystem paths, but basename from node:path is not imported in this file — per CDQ-007, the raw value is used and noted as a known limitation. The attribute provides essential diagnostic context for early-exit spans (when readdir fails on a missing directory, the span would otherwise carry no attributes at all).
- getTodayString and getNowDate are synchronous pure helpers with no I/O — skipped per RST-001 (no spans on synchronous non-I/O functions) and RST-004 (unexported functions whose execution paths are fully covered by their calling orchestrator spans).
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported async functions. While RST-004 would normally defer to the exported orchestrator, the pre-instrumentation analysis explicitly listed them as COV-004 targets, so each receives its own span to provide granular I/O visibility within the orchestrators.
- Inner catch blocks in all instrumented functions (handling ENOENT from readdir by returning [] or new Set()) are graceful-degradation catches — they do not rethrow. Per NDS-007, no recordException or setStatus(ERROR) was added to these catches. The outer span-level catch handles only unexpected errors that escape the inner guards.
- The return expression in findUnsummarizedDays was a direct return of entryDays.filter(...). The return-value capture exception was applied to extract the result to a const so span.setAttribute could record the output count before returning — the filter call expression is preserved exactly, only the statement form changed from return to const+return.
- commit_story.summary.dates_count (registered) is used for getDaysWithEntries, getSummarizedDays, getDaysWithDailySummaries, and findUnsummarizedDays — all return collections of YYYY-MM-DD date strings, matching the attribute's semantic. commit_story.summary.weeks_count (registered) is used for getSummarizedWeeks, getWeeksWithWeeklySummaries, and findUnsummarizedWeeks — all return ISO week string collections. commit_story.summary.months_count (registered) is used for getSummarizedMonths and findUnsummarizedMonths.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):63: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):95: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):115: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):132: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):154: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):170: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):190: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):207: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):227: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):245: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):267: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):296: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):316: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):333: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):353: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):371: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):393: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):434: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and instrument it according to the schema and rules.

Functions to instrument:
1. `getDaysWithEntries` (exported, COV-001) - line 57
2. `findUnsummarizedDays` (exported, COV-001) - line 124
3. `getDaysWithDailySummaries` (exported, COV-001) - line 172
4. `findUnsummarizedWeeks` (exported, COV-001) - line 200
5. `findUnsummarizedMonths` (exported, COV-001) - line 290
6. `getSummarizedDays` (async, COV-004) - line 97
7. `getSummarizedWeeks` (async, COV-004) - line 147
8. `getSummarizedMonths` (async, COV-004) - line 237
9. `getWeeksWithWeeklySummaries` (async, COV-004) - line 262

I'll skip the utility functions like `getTodayString` and `getNowDate` since they're synchronous helpers that don't need coverage instrumentation.

Now I'm checking the schema to see what span names are already defined and available. I can see spans like `commit_story.summary.check_existing` and `commit_story.summary.daily_node` are already in use, but the functions I need to instrument don't have direct matches. I'll need to create new span names following the same pattern, like `commit_story.summary.get_days_with_entries` and `commit_story.summary.find_unsummarized_days`, making sure they don't conflict with existing ones. Looking at the available attributes like `dates_count`, `entries_count`, `weeks_count`, and `months_count`, I'm mapping each method to the appropriate attribute — using `dates_count` for day-related operations, `weeks_count` for week operations, and `months_count` for month operations, though I need to think through whether these counts actually give me what I need for the summarized versus unsummarized distinctions.

I'm also noticing that `basePath` is a parameter I should capture, but there's no existing schema key for it. I could extend the schema or handle it differently, though I need to consider the project's conventions around file paths and whether to use `basename` or project-relative paths if those utilities are already available.

For the catch blocks in these functions that return empty collections without rethrowing, those are graceful degradation patterns that shouldn't get exception recording or status updates. The outer span wrapper will have its own error handling, so I need to be careful about how I structure the try/catch pattern—keeping the inner catches intact while letting the wrapper handle unexpected errors.

For attributes, I'm thinking about what to capture from each function: `getDaysWithEntries` returns a sorted array so I can track the count via `dates.length`, and `getSummarizedDays` returns a Set where I can use `.size` for the count. Both are direct property accesses, so no guard needed for the setAttribute calls.

Now I'm mapping out the attributes for each function - `findUnsummarizedDays` and `getDaysWithDailySummaries` both return arrays that feed into `dates_count`, while `getSummarizedWeeks`, `findUnsummarizedWeeks`, and `getSummarizedMonths` track their respective counts using `.size` or `.length` on the return values. Writing span wrapper code... Refining the error handling structure...

When an inner catch block returns early, the outer catch doesn't execute—only the finally block runs to clean up the span. So for functions like `getDaysWithEntries` that gracefully return an empty array on certain errors, the span still gets properly ended even though we're not throwing.

The key insight is that I can set input attributes before the inner try/catch blocks to ensure they're captured regardless of which path executes, which satisfies the requirement about capturing inputs on all code paths. Writing instrumented code... For `findUnsummarizedWeeks` and `findUnsummarizedMonths`, the returns are already computed variables, so I can capture and attribute them the same way. Now I'm ready to write out the full instrumented file, being careful to avoid modifying inner catch blocks, place attributes correctly, and handle errors properly in the outer catch. I'm also thinking through the span categories—the filesystem calls like `readdir` are already covered by parent spans, so I don't need to treat them as separate external calls. I'm instrumenting the 9 async functions with tracing spans, which means I need to add 9 new span name definitions to the schema following the naming pattern for this module.

The attributes I'm using are already registered in the schema, so no new attributes need to be created. I considered adding `basePath` for diagnostic context but decided against it since it's typically just the default value and doesn't provide much value.

Writing the instrumented file... Adding instrumentation to capture result counts...

Now I'm writing out the complete instrumented file, making sure to preserve all the original logic while wrapping the key functions with telemetry spans and capturing their return values before the functions exit. Writing utility functions... Writing function logic... Finishing the function to iterate through the files, extract dates that match the pattern, record the count in the span, and handle any errors with proper exception logging and cleanup.

Now I'm implementing the main function that finds days with journal entries but no summaries, filtering out today and any dates at or after an optional cutoff date. Writing the complete file... Finishing the filter logic and capturing the result length in a span attribute, then returning the filtered array. All the attributes being set are already registered in the schema, so there are no newly discovered attributes to count.

Now looking at the span categories across the file: there are no external calls from allowlisted libraries, and none of the spans are predefined in the schema. I'm counting five service entry points from the exported functions, with eleven total functions in the file. The four unexported async functions appear to be COV-004 violations.

But I need to reconsider RST-004, which says not to instrument unexported internal functions if an exported orchestrator already covers their execution path. Since `findUnsummarizedDays` has a span and calls `getSummarizedDays`, that means `getSummarizedDays` shouldn't get its own span—the orchestrator span should be sufficient. The pre-instrumentation analysis is explicit about instrumenting all nine async functions, so I'll follow that guidance rather than second-guessing the rules. Even though some of these functions are called by orchestrators that already have spans, the analysis takes precedence, so I'll add spans to all of them as specified. Writing the complete implementation... `path` isn't imported in the file, so I can't use `basename()` to transform the path. Since `basePath` defaults to `'.'` anyway, creating an extension attribute for it doesn't add much value. I'll leave the span without that attribute rather than introduce a new registry key for something that's not particularly meaningful. I'm adding the `commit_story.summary.base_path` schema extension as a string attribute to track the base path used for journal operations, and counting it as 1 new unique attribute key since it's a single new key used across multiple spans.

Now I'll write out the complete instrumented code, making sure to import the OpenTelemetry API, initialize the tracer, wrap each async function with a span, set the `basePath` attribute unconditionally when the span opens, add the result count attribute before successful returns, handle inner catches gracefully without error recording, and use the outer catch to record exceptions and set error status. Writing the final code... Finishing the filter function...
```
