# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 13.8K

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
- `commit_story.journal.weeks_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString and getNowDate are pure synchronous functions with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries are unexported but are instrumented per the pre-instrumentation COV-004 directive — they each perform async filesystem I/O and represent meaningful async work units distinct from their callers.
- All inner try/catch blocks (e.g., catch { return []; }, catch { continue; }, catch { return new Set(); }) are graceful ENOENT degradation paths — no recordException or setStatus(ERROR) was added to them per NDS-007 (expected-condition catches must not be marked as errors).
- commit_story.journal.weeks_count is a new attribute declared in schemaExtensions — no registered key semantically matches a count of ISO week strings (commit_story.summary.week_label is a single label string, not a count; commit_story.journal.dates_count is for date counts). This new key follows the same namespace and naming pattern as other count attributes in the registry.
- commit_story.summary.months_count (already registered) was used for getSummarizedMonths and findUnsummarizedMonths output counts — its registered brief matches 'count of months' semantics for both functions.
- commit_story.context.repo_path (already registered) was used for basePath on all spans — it represents the repository base path passed to each function, matching the registered key's semantics.
- Raw basePath values are used for commit_story.context.repo_path without basename transformation — path.basename is not imported in this file, and CDQ-007 only requires transformation when the utility is already available.
- findUnsummarizedDays required extracting the entryDays.filter(...) return expression to a const named result so span.setAttribute could capture the output count before returning — this is the permitted return-value capture exception for method-call expressions.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):63: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):95: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):115: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):132: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):154: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):170: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):190: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):227: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):245: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):267: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):316: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):333: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):353: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
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
1. `getDaysWithEntries` (line 57) - COV-001 entry point, exported async
2. `getSummarizedDays` (line 97) - COV-004, async
3. `findUnsummarizedDays` (line 124) - COV-001 entry point, exported async
4. `getSummarizedWeeks` (line 147) - COV-004, async
5. `getDaysWithDailySummaries` (line 172), `findUnsummarizedWeeks` (line 200), `getSummarizedMonths` (line 237), `getWeeksWithWeeklySummaries` (line 262), and `findUnsummarizedMonths` (line 290) all need instrumenting as well, while `getTodayString` and `getNowDate` can be skipped since they're synchronous with no I/O.

I'm working out span names for each function, inventing new ones where the schema doesn't already define a match, like `commit_story.journal.get_days_with_entries` and `commit_story.journal.get_days_with_daily_summaries`.

Checking the schema more carefully, none of the existing span names (like `discover_reflections`, `ensure_directory`, `generate_and_save_daily_summary`) match these functions, so I'll need to extend the schema with new entries for all of them. Now I'm thinking through the attributes for `getDaysWithEntries` -- the `basePath` input is a filesystem path, and per CDQ-007 I should avoid using raw filesystem paths and prefer a basename or project-relative path instead.

I'm going through each remaining function and mapping basePath to `commit_story.context.repo_path`, while trying to match output counts to existing registered keys like `dates_count`, though several cases (weeks, months, summarized days) don't have exact matches and may need new attribute names. I'm also double-checking CDQ-007's guidance on raw filesystem paths to make sure basePath usage is compliant.

`commit_story.journal.dates_count` fits date counts well since it's registered as int. For weeks and months, though, I don't see an exact match, so I'll likely need extensions like `commit_story.journal.weeks_count`, while `commit_story.summary.months_count` seems reusable for month counts in some contexts.

I'm now mapping out attributes function by function -- for each of `getDaysWithEntries`, `getSummarizedDays`, `findUnsummarizedDays`, `getDaysWithDailySummaries`, `findUnsummarizedWeeks`, and `getSummarizedWeeks`, I'm pairing `commit_story.context.repo_path` for the input path with either `dates_count` or a new `weeks_count` extension for the output counts.

Continuing the mapping into `getSummarizedMonths`, `getWeeksWithWeeklySummaries`, and `findUnsummarizedMonths`, using `months_count` or `weeks_count` depending on the granularity.

For CDQ-006, I'm noting that `.length` and `.size` are simple property accesses, so no isRecording guard is needed there. For the try/catch patterns, most functions have inner catches for expected conditions like ENOENT that just return defaults -- per NDS-007, those shouldn't get error recording, while the outer span wrapper needs its own try/catch with error recording per COV-003.

Now I'm writing the instrumented version, keeping inner try/catch blocks intact while wrapping each function in a span with an outer try/catch/finally for exception recording. For `getDaysWithEntries` specifically, I'm preserving its two inner try/catches for directory reads and wrapping the whole thing in a span that catches unexpected errors and records them.

Wrapping the whole function body in try/finally so the span always closes properly, with the early-return case for missing directories handled inside the try block before falling through to the date-collection loop.

I'm considering whether to set dates_count=0 in the early-return catch block before returning []. Since I can add attributes without modifying existing logic, adding that setAttribute call there seems acceptable per the constraints even though the surrounding code is original.

Setting the repo_path input attribute unconditionally satisfies COV-005, so I don't need to worry too much about the output attribute on the early-exit path. Now I need to check whether unexported helper functions like getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries need their own spans, or whether the exported orchestrator functions calling them already provide sufficient coverage per RST-004's rule about not instrumenting internal functions when an orchestrator span covers them.

Since the pre-instrumentation analysis flags these under COV-004, I'll add spans to them anyway. For attribute naming, I'm reconsidering whether to reuse the already-registered `commit_story.journal.dates_count` attribute for these date-counting functions rather than introducing new ones, since the semantics are close enough to avoid attribute sprawl.

Listing out schema extensions needed...

I need `commit_story.journal.weeks_count` as a new int attribute, and I'm figuring out that attributesCreated should count new attribute keys added, even if reused across multiple spans.

Checking that only weeks_count is truly new since dates_count, repo_path, and months_count are already registered in the schema, so attributesCreated = 1. Now I'm confirming which setAttribute calls need isRecording() guards versus simple direct property reads that don't need protection.

None of the attribute calls need guards since they're all simple property accesses, and COV-001 entry points are exempt from these guards anyway. I'm also revisiting whether getSummarizedDays needs its own span despite being an unexported internal function called from findUnsummarizedDays — the pre-instrumentation analysis explicitly calls for it under COV-004, so I'll follow that guidance and add the span, then move on to checking the try/catch blocks that use bare catch statements.

Writing file rewrite code...

Writing more journal functions...

Since it's a method call on filter results, this fits the same allowed pattern. I'm confirming `getSummarizedWeeks` follows an identical structure with a weeks-count attribute, and moving on to check `getDaysWithDailySummaries` for the same convention.

Now I'm going through each remaining function—unsummarized weeks, summarized months, weeks with summaries, unsummarized months—confirming they all return simple counts via consistent attribute names. I'm about to start tallying the total function count in the file to verify span categories.

Counting up totalFunctionsInFile gives 11, serviceEntryPoints (the exported async functions) gives 5, schemaDefined is 0 since none appear as span definitions, and I'm now checking externalCalls—readdir is a filesystem call, which OpenTelemetry can auto-instrument via its fs instrumentation package rather than needing manual spans.

The four unexported functions like getSummarizedDays and getWeeksWithWeeklySummaries also get spans under COV-004, but since there's no separate category for those, I'll fold them into serviceEntryPoints since they act as entry points for their respective operations.

Since there's no dedicated category for the unexported async spans, I'll fold them into serviceEntryPoints as the closest fit, even though they aren't strictly service entry points.

Total spans added: 9 (5 exported + 4 unexported async), all counted under serviceEntryPoints since none are external calls or schema-defined. I'm settling on this breakdown and moving on to finalize the implementation, though I still need to double check the `findUnsummarizedDays` logic.

I need to capture the filtered result in a variable so I can attach a `dates_count` attribute to the span before returning it, which is allowed since `.filter()` is a method call covered by the return-value capture exception. I'll apply the same pattern to `findUnsummarizedWeeks`.

Adding count attributes to more functions...


```
