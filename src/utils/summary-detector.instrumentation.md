# Instrumentation Report: src/utils/summary-detector.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 4.5K
- **Output tokens**: 21.3K

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
- `commit_story.summary.unsummarized_days_count`
- `commit_story.summary.unsummarized_weeks_count`
- `commit_story.summary.unsummarized_months_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- getTodayString is a pure synchronous helper with no I/O — skipped per RST-001 (no spans on synchronous utilities).
- getNowDate is a pure synchronous helper with no I/O — skipped per RST-001.
- getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries are unexported async functions with filesystem I/O not covered by any exported orchestrator span — instrumented as COV-004 targets. The 4 additional spans are not reflected in serviceEntryPoints since they are internal helpers, not entry points.
- commit_story.summary.base_path is a new string attribute capturing the sanitized last path segment of the basePath parameter. No registered key semantically matches 'the journal root directory being scanned'. Sanitized using inline split/pop to avoid leaking full filesystem paths per CDQ-007.
- commit_story.summary.unsummarized_days_count is a new int attribute for the count of days with entries but no daily summary. The registered commit_story.summary.daily_count describes count of days WITH daily summaries, which is the opposite concept — not a semantic match. A dedicated extension key is needed.
- commit_story.summary.unsummarized_weeks_count is a new int attribute for the count of weeks with daily summaries but no weekly summary. commit_story.summary.weekly_count describes count of weeks WITH weekly summaries — opposite semantics.
- commit_story.summary.unsummarized_months_count is a new int attribute for the count of months with weekly summaries but no monthly summary. commit_story.summary.month_count describes count of months WITH monthly summaries — opposite semantics.
- Inner catch blocks in getDaysWithEntries (monthDirs not found, files not found), getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getDaysWithDailySummaries, and getWeeksWithWeeklySummaries return empty collections as graceful degradation for missing directories — no recordException or setStatus added per NDS-007.
- basePath.split/filter/pop chain requires a CDQ-006 isRecording() guard on COV-004 (non-entry-point) spans: getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries. COV-001 entry point spans are exempt from CDQ-006.
- commit_story.summary.entry_count, commit_story.summary.daily_count, commit_story.summary.weekly_count, and commit_story.summary.month_count are already registered in the schema and used directly via span.setAttribute without extension declarations.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):97: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):136: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):215: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):255: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):347: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):387: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
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
1. `getDaysWithEntries` (line 57) - exported async, COV-001
2. `findUnsummarizedDays` (line 124) - exported async, COV-001
3. `getDaysWithDailySummaries` (line 172) - exported async, COV-001
4. `findUnsummarizedWeeks` (line 200) - exported async, COV-001
5. `findUnsummarizedMonths` (line 290) - exported async, COV-001
6. `getSummarizedDays` (line 97), `getSummarizedWeeks` (line 147), `getSummarizedMonths` (line 237), and `getWeeksWithWeeklySummaries` (line 262) - all async, COV-004

I'm skipping `getTodayString` and `getNowDate` since they're synchronous per RST-001, and working out span names for each function based on the schema, making sure to reuse `commit_story.summary.read_day_entries` where it's already defined and deriving new names like `commit_story.summary.get_days_with_entries` and `commit_story.summary.find_unsummarized_days` for the rest.

Now I'm considering the `basePath` parameter - it's a filesystem path but functions more like a configuration value, so I need to think about whether to sanitize it per CDQ-007.

None of the registered keys cleanly match "count of days with entries," so I'm considering declaring a new extension attribute to capture that result count rather than forcing it into the existing daily_count definition.

I see the schema also lists `month_count` and `entry_count` as agent-discovered attributes, but I'm wary of reusing these since their semantics aren't well-specified and I want to avoid imprecise mappings (SCH-002). I'll instead define clearer, purpose-built extension attributes for each detector function rather than forcing my data into these ambiguous existing ones.

I'll continue mapping: summarized weeks and weeks-with-summaries both map to a weekly count attribute, summarized months to a monthly count. For the unsummarized finders, I don't see an exact match so I'll declare new count attributes for unsummarized days, weeks, and months. Now I need to check whether basePath, as an input parameter, needs separate handling per CDQ-007.

For basePath specifically, since it's usually just the project root like '.', it's low signal, but COV-005 wants at least one meaningful attribute per function, so I'll still capture it sanitized. I'm now walking through each function individually to decide what inputs and outputs to capture, starting with getDaysWithEntries (basePath in, entry count out) and getSummarizedDays (output size mapping to a summary attribute).

Continuing through the list: findUnsummarizedDays needs the options.before input and unsummarized day count output, getDaysWithDailySummaries needs its date count, findUnsummarizedWeeks and getSummarizedWeeks need their respective counts, and I'm now working out the output mapping for getSummarizedMonths.

Looking at the try/catch structure, the inner catches that gracefully degrade to empty defaults shouldn't get exception recording per NDS-007, but the outer span-wrapping catch does need recordException and setStatus. I also want to check whether an isRecording() guard is needed per CDQ-006.

For the output counts like array lengths, these are direct property accesses so they don't need guards. I'm working through how to capture the size from a Set before it's returned, since I can grab that value right before the return statement inside the function rather than after calling it externally.

Now I'm thinking through the basePath attribute naming convention for the filesystem path parameter.

Actually, reconsidering basePath - since it's almost always just '.' in practice, sanitizing it wouldn't give much diagnostic value, so I'll skip capturing it and focus on the more useful output attributes instead. I'm making sure every span has at least one attribute for compliance, and confirming that property accesses like length or size don't require recording guards.

Now looking at getDaysWithEntries, I see two inner catch blocks that swallow errors gracefully without recording them, which means the outer span's catch would never see those errors anyway. I'm wrapping the whole function body in startActiveSpan with try/catch/finally, keeping the inner catches untouched...

Writing the instrumented function...

That would double-end the span, so I'll simplify by relying solely on the finally block, letting inner catches just return early without ending the span themselves since execution still flows through finally.

Now applying the same pattern to getSummarizedDays, I need to capture dates.size as the attribute before returning, then wrap the body in the same try/catch/finally structure.

For findUnsummarizedDays, since filter returns an array synchronously, I can extract the filter result into a const, add the count attribute, and return it—fitting the return-value capture exception.

I also need to decide on input attributes, guarding the optional `options.before` with a null check before setting the cutoff date attribute.

For the remaining functions, I'll follow the same pattern: `getDaysWithDailySummaries` maps its count to `commit_story.summary.daily_count` (same semantics as the earlier reuse), `findUnsummarizedWeeks` gets a new extension key `commit_story.summary.unsummarized_weeks_count`, and `getSummarizedWeeks` maps to `commit_story.summary.weekly_count`. I'm continuing through the monthly summary functions next.

I'm continuing to map the remaining functions to spans not yet in the schema, then noting the new attribute extensions needed: unsummarized day, week, and month counts as integers.

Several existing count attributes are already registered, so I only need three new attribute extensions alongside nine span extensions. Now I'm working through how `findUnsummarizedDays` should be instrumented, deciding to capture the filtered result as a whole rather than setting span attributes inside the per-item filter callback.

For `findUnsummarizedWeeks` and `findUnsummarizedMonths`, I can add count attributes right before their existing returns since those variables are already named locals. Same approach works for `getDaysWithEntries` where `dates` is built in a loop and sorted before returning.

Adding count attributes to getters...

Checking CDQ-006 guards: since all these setAttribute calls use `.length` or `.size`, which are property accesses rather than method calls, no isRecording() guards are needed there.

I'm confirming the early-return catch paths still correctly end spans via finally, and now considering whether to add input attributes like basePath per COV-005.

Since the registered output attributes already satisfy COV-005, I don't strictly need basePath, but I'm weighing whether capturing it unconditionally at span open would add diagnostic value given it's often just a low-signal default path.

Now I'm noticing a bigger issue: for `getDaysWithEntries`, the attribute I set after the loop never gets applied if the inner catch returns `[]` early when `entriesDir` doesn't exist. That early-return path leaves the span without its output attribute entirely.

Per COV-005, I need to set input parameter attributes unconditionally right at span open, before any branching or early-return checks, so the span still carries context even on the early-exit path. Since `basePath` is really the only input param here, I should set it immediately at the start of the span rather than waiting until after the loop logic.

I realize CDQ-006 only applies outside COV-001 entry points, so getSummarizedDays needs the guard while something like getDaysWithEntries doesn't. I'll treat basePath differently depending on context—unguarded for entry-point spans, guarded with isRecording() for the others—since the sanitization logic involves method calls on the string.

basePath is always a string so splitting on it is safe, but CDQ-006 still wants the guard for non-COV-001 functions, and since the variable is named like a path, CDQ-007 says it needs sanitizing too. I'll capture basePath everywhere, sanitize with split/pop, and wrap it in the isRecording guard except for COV-001 entry points.

My reasoning is that the output attribute only gets set after the inner try/catch completes, so if that catch fires first, the span never gets that attribute at all — meaning capturing basePath upfront is the only way to guarantee every span has at least one attribute even when it exits early.

For COV-004, I'll use the guard, and I'm adding a new extension attribute for the base path being scanned. Now I'm confirming that basePath needs sanitization per the filesystem path rule, using the split/filter/pop approach since no basename import exists yet.

Settling on: COV-001 entry points need no guard, COV-004 needs the isRecording guard, and both capture the sanitized basePath. Writing the import statement...

Still writing directory scan logic...

I'm sorting the collected dates, recording the entry count on the span, and wrapping everything with exception recording and proper span cleanup in a finally block. I'm double-checking that the basePath attribute setting placed outside the try block is safe since it's just a simple string operation that shouldn't throw.

Actually, to be safe I should move that basePath attribute call inside the try block so the span still closes properly even if something unexpected happens. I'm also reconsidering the CDQ-006 exemption rule for COV-001 entry points like getDaysWithEntries, meaning I may not need an isRecording guard there.

Now I'm working out which specific functions need the isRecording guard versus which don't: unsummarized-day finders skip it, while getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, and getWeeksWithWeeklySummaries need the guard since they're COV-004 functions. With that logic settled, I'm ready to write out the full file carefully, making sure not to touch existing code, preserving the try/catch structure, adding span attributes before early returns, and keeping error recording in the outer scope.

Tracing through findUnsummarizedDays specifically, I notice it has an early return when entryDays is empty, which is exactly the kind of branch where I need to insert a span attribute before returning.

I should set basePath as an input attribute unconditionally before that guard check, and even on the early-return path with zero entries, I still need to record the output count attribute as 0 rather than skipping it.

Since the original is a single-line if-return, I can't insert a statement between the condition and return without restructuring the layout, which NDS-003 forbids—so I'm stuck without a way to add that attribute safely.

Instead I'll set the basePath attribute before the guard, accept that the early-return path won't log the count, and capture the filter result into a variable so I can set the unsummarized_days_count attribute right before the final return on the normal path.

Now I'm reconstructing the full file, preserving the unchanged helper functions and restructuring getDaysWithEntries to wrap its logic in the tracing span.

Finishing collecting matching date files, sorting them, and recording the entry count on the span before returning. I'm confirming the CDQ-006 exemption applies to this chained path method, so no extra guard is needed here, and now moving to check the guard requirements for getSummarizedDays under COV-004.

Still writing span tracing logic...

Finishing the error handling for that span, then moving to getSummarizedWeeks, which mirrors getSummarizedDays but tracks weekly summaries in a Set instead.

Writing the daily summaries scanner function...

Still writing week-detection logic...

Writing getSummarizedMonths function...

Still writing span logic...

Now I'm moving on to implementing `findUnsummarizedMonths`, which traces the operation, gets the weeks that already have weekly summaries, and returns early if none exist before grouping those weeks by month.

Still computing week-to-month mapping...

Now I'm comparing each month that has weekly entries against the current month and the already-summarized months, collecting any that are unsummarized and sorting the result before returning it, with error handling for tracing.

So schemaDefined is 0 since none of these span names exist in the schema yet. Now I'm checking the attributes: base_path, unsummarized_days_count, unsummarized_weeks_count, and unsummarized_months_count are new extensions, while entry_count, daily_count, weekly_count, and month_count are already in the registry.

So attributesCreated comes out to 4. Now I'm compiling the full list of new span names needed for the schema extensions.

I'm working through where these four new COV-004 spans fit into the fixed category buckets—they're not entry points or schema-defined or external calls, so I need to figure out whether they count as serviceEntryPoints or just get tallied into totalFunctionsInFile.

I'm second-guessing the category assignment since there's no clean match for these four internal helper spans in the schema's defined categories. I'll settle on noting the discrepancy rather than forcing them into externalCalls or schemaDefined, since serviceEntryPoints is meant for exported entry points, not internal helpers.

I'm settling on externalCalls: 0, schemaDefined: 0, serviceEntryPoints: 5, totalFunctionsInFile: 11, with the four extra spans called out separately. I'm also verifying that the same underlying count field can be reused across the paired daily/weekly summary getter functions since they share identical semantics.

I'm skipping adding a new extension for the `options.before` cutoff value in `findUnsummarizedDays` since it's not worth the added complexity, and confirming no registered keys leak into schemaExtensions before moving on to finalize the full instrumented code output.


```
