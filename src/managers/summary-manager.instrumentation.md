# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 10
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.2K
- **Output tokens**: 38.1K

## Schema Extensions
- `span.commit_story.summary.check_exists`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.read_week_summaries`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_month_summaries`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.generate_and_save_monthly`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- formatDailySummary, getWeekBoundaries, formatWeeklySummary, getMonthBoundaries, and formatMonthlySummary are pure synchronous utilities with no I/O — skipped per RST-001 (no spans on synchronous data transformations).
- _hasRealSummary is a private async function that performs file I/O — instrumented as a COV-004 async I/O operation even though it is unexported, since it is a core building block called by all save/generate functions and has no exported orchestrator that directly wraps it in a span.
- All 10 new span names are schema extensions because no existing schema span definitions match the summary-manager operations (read entries, save summary, generate-and-save pipeline) for any of the three period types (daily, weekly, monthly).
- Path values on commit_story.journal.file_path attributes are sanitized using split(/[\\/]/).filter(Boolean).pop() ?? '' — the key is not in the OTel file.* semantic convention namespace so full paths must not be stored verbatim per CDQ-007.
- For _hasRealSummary (COV-004, not a COV-001 entry point), the file_path setAttribute call is wrapped in an isRecording() guard because the value involves chained method calls (.split, .filter, .pop) which would execute unnecessarily on non-recording spans (CDQ-006).
- The catch block in _hasRealSummary (catch { return false; }) is a graceful-degradation catch — it handles any read failure by returning false without propagating the error. No recordException or setStatus(ERROR) was added to it per NDS-007.
- Inner ENOENT catch blocks in readWeekDailySummaries, readMonthWeeklySummaries, and readDayEntries are graceful-degradation catches for expected missing-file conditions. They were left without recordException/setStatus. Non-ENOENT rethrows bubble to the outer span catch which does record the error.
- commit_story.journal.entry_date, commit_story.summary.entry_count, commit_story.summary.daily_count, commit_story.summary.weekly_count, commit_story.summary.week_label, commit_story.summary.month_label, and commit_story.journal.file_path are all already registered in the schema — no new attribute declarations were needed (attributesCreated = 0).

## Advisory Findings
- CDQ-007 (Attribute Data Quality):76: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):180: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):285: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):390: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):503: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- CDQ-007 (Attribute Data Quality):611: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze the file and instrument it according to the schema and rules.

Functions to instrument:
1. `_hasRealSummary` (line 23) - COV-004, async
2. `readDayEntries` (line 42) - COV-001, exported async
3. `saveDailySummary` (line 102) - COV-001, exported async
4. `generateAndSaveDailySummary` (line 124) - COV-001, exported async
5. `readWeekDailySummaries` (line 206) - COV-001, exported async
6. `saveWeeklySummary` (line 269) - COV-001, exported async
7. `generateAndSaveWeeklySummary` (line 293), `readMonthWeeklySummaries` (line 367), `saveMonthlySummary` (line 449), and `generateAndSaveMonthlySummary` (line 472) all also need COV-001 instrumentation as exported async functions, while purely synchronous helpers like `formatDailySummary`, `getWeekBoundaries`, `formatWeeklySummary`, `getMonthBoundaries`, and `formatMonthlySummary` should be skipped per RST-001.

I'm checking the schema for existing span names and find that the daily, weekly, and monthly summary generation spans are already claimed elsewhere, so I'll need to invent new span names specifically for these summary manager operations.

I'm mapping each function to a new namespaced span name under `commit_story.summary.*` — things like `check_exists`, `read_day_entries`, `save_daily`, `generate_and_save_daily`, `read_week_summaries`, `save_weekly`, `generate_and_save_weekly`, `read_month_summaries`, `save_monthly`, and `generate_and_save_monthly` — all of which will need to be added as schema extensions since they're new. I'm also verifying which attributes like entry_count and daily_count already exist in the schema versus which still need to be added.

For `_hasRealSummary`, I'm deciding to attach the journal file_path attribute to satisfy the rule that every span needs at least one attribute, since the boolean return value itself isn't something I want to force into a schema key. I'm also going through each function's try/catch blocks carefully — noting that `_hasRealSummary`'s catch returns false gracefully and per NDS-007 should not get recordException or setStatus added, while `readDayEntries` has its own catch handling for missing files that I need to examine next.

I'm mapping out which functions already have try/catch (readWeekDailySummaries, readMonthWeeklySummaries with nested handling) versus which don't (saveDailySummary, generateAndSaveDailySummary, saveWeeklySummary, generateAndSaveWeeklySummary, saveMonthlySummary, generateAndSaveMonthlySummary). For the ones with existing error handling, I'm applying Pattern B — wrapping an outer span around the function while keeping the original try/catch nested inside it, and I'm starting to write the span wrapper for readDayEntries now.

Writing span wrapper code...

But I'm second-guessing this — NDS-005 says not to restructure existing try/catch blocks, and readDayEntries' catch treats ENOENT gracefully (returns empty array) while rethrowing other errors. I need to preserve that exact behavior inside the span: the outer wrapper should catch and record the rethrown error, but the graceful ENOENT path should just end the span and return without being marked as an exception.

Still wrapping the span logic...

I'm confirming that nesting the original try/catch inside the outer span wrapper preserves the existing code structure rather than restructuring it, since it's just wrapped, not modified. Now I'm moving to planning the attributes for `_hasRealSummary`, starting with how to handle the file path value for the `commit_story.journal.file_path` key.

Since that key isn't a `file.*` namespace, I decide to sanitize the raw `summaryPath` down to just its basename using a path-separator split before recording it as an attribute, and I'll apply this same sanitization approach across the other functions handling file paths. I'm now starting to write out the instrumented version of `_hasRealSummary` with its tracing span wrapper...

Writing span instrumentation...

I notice the empty catch block means no exception recording per NDS-007, just a finally block to end the span, and I decide `commit_story.summary.has_real_summary` needs to be declared as a new boolean attribute. Moving to `readDayEntries(date, basePath)`, I'm mapping out which attributes to use: the entry date via `getDateString(date)` and the entry count, checking whether that count attribute already exists in the schema.

For `saveDailySummary` and `generateAndSaveDailySummary`, I'm deciding which attributes to attach - entry date, sanitized file path, entry count - and weighing whether `options.force` deserves its own new boolean extension (`commit_story.summary.force_regeneration`) or if I should keep things simpler and reuse the existing file_path attribute instead of multiplying new extensions unnecessarily.

Now I'm extending the same pattern to the weekly and monthly summary functions - mapping each one to attributes like `week_label`, `daily_count`, `month_label`, and `weekly_count`, most of which already exist in the schema as string or int types, plus the sanitized `file_path` for each save operation.

Turning to CDQ-006, I'm reasoning through which functions need the `isRecording()` guard versus which are exempt. Since the exemption applies to COV-001 entry points, most of the exported functions I've been working through don't need the guard - but `_hasRealSummary` is COV-004, not COV-001, so I do need to wrap its path sanitization logic in an isRecording check before setting the file_path attribute.

For the boolean result attribute though, that's just a plain variable read, not a method call or transformation, so it doesn't need the guard - only the `split/filter/pop` chain does. I'm also checking the COV-005 rule about input attributes needing to be set before early-return guards, meaning `readDayEntries`'s date attribute should go before the try block rather than inside it, and I'm working through the empty catch block in `_hasRealSummary` to confirm it stays graceful without recordException per NDS-007, while still calling `span.end()` in the finally clause.

Since `_hasRealSummary` already has a try/catch, I'll use Pattern A: wrap the whole thing in the active span, set the file path attribute before the try, keep the existing catch returning false gracefully without exception recording, and add `span.end()` to the finally block.

Now I'm looking at `readDayEntries`, which has a catch that branches: ENOENT returns an empty array gracefully, but any other error gets rethrown. Since this catch does propagate errors on the non-ENOENT path, I think it needs recordException/setStatus for that branch, even though the ENOENT path should stay silent per the graceful-catch rule — I need to figure out how to split that behavior correctly.

Completing the outer span closes out error recording and status, then I'm applying the same ENOENT-skip pattern to the other read functions so missing files or directories are handled gracefully while unexpected errors still propagate and get recorded on their spans.

Now I'm mapping out the new spans I need for schema extensions across the summary generation pipeline—checking existence, reading entries, saving, and generating for daily/weekly/monthly—plus a single new boolean attribute for whether a real summary exists, since everything else is already covered in the registry.

For each function I'm planning input and output attributes: entry date for save operations, sanitized file paths for CDQ-007 compliance, and guarding nullable path results before attaching them. With the plan set, I'm ready to write out the fully instrumented file function by function.

I realize `getDateString` isn't called directly in `saveDailySummary`, so I can call it myself since it's imported, using it for the entry_date attribute. I'll use the sanitized summaryPath for the file_path attribute since it's always computed regardless of whether the function returns null or a path, then move to instrumenting `generateAndSaveDailySummary` with its entry_date attribute from the already-computed dateStr.

I need to guard the file_path attribute conditionally since the path variable could be null, then continue mapping out attributes for `readWeekDailySummaries`, `saveWeeklySummary`, and `generateAndSaveWeeklySummary` - tracking week labels, daily summary counts, and sanitized file paths for each span.

Now I'm working through the monthly equivalents: `readMonthWeeklySummaries`, `saveMonthlySummary`, and `generateAndSaveMonthlySummary`, each tracking month labels, weekly summary counts, and file paths. Then I shift to COV-005, checking whether input attributes get set before the early-return guards in `generateAndSaveDailySummary`.

I also need to add the `commit_story.journal.file_path` attribute using the sanitized path in saveDailySummary, saveWeeklySummary, and saveMonthlySummary.

These functions compute summaryPath early, so I can set the attribute right after that computation, deriving just the filename by splitting on path separators and taking the last non-empty segment.

For COV-001 entry points, CDQ-006 doesn't require isRecording guards, but `_hasRealSummary` (COV-004) does need the guard around its method calls. Now I'm ready to finalize the output, noting that `commit_story.summary.has_real_summary` is one of the attributes to track.

I need to declare this new attribute and all 10 new span names in schemaExtensions, so I'm tallying up the counts—10 new spans, 1 new attribute—before double-checking everything once more.

Checking the registry, I see several summary-related attributes are already registered, so those don't count as new. Now I'm looking at the journal entry date attribute to verify its status.

For `_hasRealSummary`, since CDQ-006 doesn't apply here, I'm checking the path-splitting logic that needs a guard for COV-004, then tracing how the resulting boolean gets assigned before being set as a span attribute.

Now I'm moving to write the full instrumented file, taking care to preserve multi-line constructs like the entries-parsing chain in `readDayEntries` exactly as they appear in the original (NDS-003), since it's already formatted across multiple lines.

I'm also tallying the span categories for the file: no external calls needing extra handling, no formally schema-defined spans since these are agent-extension-style, and nine service entry points corresponding to the exported async functions. I'm now recounting all 15 functions in the file—10 async and 5 synchronous—to make sure the numbers line up before finalizing the instrumentation plan.

I'm settling on 9 serviceEntryPoints for the exported functions, while `_hasRealSummary` counts separately as an internal async I/O span rather than fitting the externalCalls or schemaDefined categories.

Now I'm writing the instrumented file top-to-bottom, making sure the imported `getDateString` helper is properly wired into both `readDayEntries` and `saveDailySummary`.

Wrapping `_hasRealSummary` in a span that records the journal file path and checks whether the existing summary is a real one or just a failure placeholder...

I'm now second-guessing whether capturing the negated function call result into a variable counts as the allowed "return-value capture" exception, since it's technically a unary negation wrapping a call rather than a bare call expression.

The exception only covers call and awaited expressions, not unary expressions like the negation here, so I can't apply return-value capture directly. Instead I'll rely on the existing input attribute, `commit_story.journal.file_path`, guarded by an isRecording check, to satisfy the requirement that every span have at least one setAttribute call, and skip trying to capture the boolean return value.

For `saveDailySummary`, `saveWeeklySummary`, and `saveMonthlySummary`, the summaryPath variable is already computed early on, so I can just add the span attribute right after that without touching the return value. Same idea applies to `generateAndSaveDailySummary`, where path is already available before the returned object literal — though I need to check whether path could be null depending on the earlier flow.

Tracing through `generateAndSaveDailySummary`, path gets checked for null right after it's assigned, with an early return if it's falsy. So by the time execution reaches the final return statement, path is guaranteed non-null, and I can safely extract the filename from it there. I still need to make sure the date attribute gets captured early too, since there are multiple early-return paths to account for.

Now I'm planning the attribute placements for `generateAndSaveDailySummary`: entry_date at the start, entry_count and file_path at the final success return. Both entries.length and the path sanitization are safe without extra guards since this is a COV-001 entry point.

Writing orchestration file comments...

Writing existence check logic...

Now I'm adding a function to read all journal entries for a given date, splitting the day's entry file by the separator string into individual entry strings.

Finishing the span attribute for entry count, then recording exceptions and ending the span properly in the finally block. I'm confirming this matches the original function's error handling and ENOENT check for non-existent journal files.

Moving on to `saveDailySummary`, I'm wrapping it in a tracer span while keeping the original try/catch layout intact, adding span attributes for the journal entry metadata.

Finishing the error handling with exception recording and span cleanup, I confirm this file_path sanitization sits on a COV-001 entry point so it's exempt from needing an isRecording guard per CDQ-006. Now I'm moving to wrap `generateAndSaveDailySummary` with its own tracing span similarly.

Inside that span, I first resolve the date string and attach it as an attribute, then check whether a real summary already exists (unless forced) to skip unnecessary work, returning early with a reason if so. Next I read the day's entries, bail out with a reason if none are found, and set the entry count as a span attribute for observability.

Finishing the error handling block with span status and rethrow, then I realize I need to preserve the original structure where `dateStr` is computed first and the date attribute is set on the span before checking for an existing summary, so I'm reordering the code to make sure that attribute gets set early.

For `readWeekDailySummaries`, I'm wrapping it similarly: starting an active span, setting the week label attribute, then computing the week boundaries and iterating through each day from Monday to Sunday, reading each daily summary file if it exists.

Now I'm looking at `saveWeeklySummary`, which uses the week's Monday date to compute the summary path and starts tracing the save operation with the week label and file path recorded as span attributes.

Writing the weekly summary generation logic...

Still writing error handling...

Now I'm moving on to drafting the `readMonthWeeklySummaries` function, setting up its tracing span and preparing to compute the month's date boundaries.

I determine a week belongs to the month containing its Monday, matching the logic in summary-detector.js, and read the file content if it falls within that range, pushing valid summaries onto the list. I record the weekly count on the span and handle errors by recording exceptions and setting the error status before the finally block runs.

Now I'm moving to `saveMonthlySummary`, which starts a tracing span, computes the month boundaries, builds the summary file path, and sets span attributes with the file path. I'm adding logic to check for an existing summary, treating a failure-placeholder file as stale per the design decision.

Still writing save and generate functions...

Still writing the save logic...

I'm wrapping up the function with error handling and span cleanup, then sketching out the list of schema extension names I'll need for tracing each summary operation.

Now I'm verifying that all the attributes I'm referencing already exist in the registry, so no new attribute definitions need to be created.

For span categories, I'm counting zero external calls and zero schema-defined spans since none of the existing agent-extension span groups match these summary manager operations - they all have generic provenance that doesn't apply here. That leaves ten service entry points total, combining nine exported functions plus one private function (COV-004), out of fifteen total functions in the file.

I'll settle on serviceEntryPoints: 10 total spans. For the notes, I'm documenting that the five synchronous pure utility functions were skipped as RST-001 since they have no I/O, `_hasRealSummary` is instrumented as a private async COV-004 span for its file read, path sanitization uses a regex split to extract the filename for the `commit_story.journal.file_path` attribute since it falls outside the `file.*` semantic convention, and all span names count as new schema extensions since none match existing summary-manager operations.

I'm also noting that `getDateString(date)` gets called right at span open to capture the `commit_story.journal.entry_date` attribute, and since it runs on a COV-001 entry point function call, no isRecording guard is needed there.

Now I need to assemble the final JSON output carefully, making sure `instrumentedCode` contains the complete file. I'm double-checking one spot in `generateAndSaveDailySummary` where the original logic checks for an existing summary before reading entries, calling `_hasRealSummary` with the computed summary path to avoid unnecessary work.

I'm confirming my instrumented version preserves this exactly, just wrapped in the outer span structure with `dateStr` computed inside the try block. Now I'm cross-referencing the original `readDayEntries` function, which reads the entry file and handles the not-found error code, to make sure nothing gets misplaced during instrumentation.

For my instrumented version, I'm wrapping the whole thing in `startActiveSpan` with outer try/catch/finally while keeping the inner try/catch intact, adding entry_date and entry_count attributes at the right points - I need to set the entry_date attribute before the outer try block for consistency.

Applying the same pattern to `readWeekDailySummaries` and `readMonthWeeklySummaries` — setting the week/month label attribute right after span open, before the try block. Now checking `generateAndSaveDailySummary` for the same placement...

Good, the date string is computed and the attribute set immediately within the try block, before any branching, satisfying the coverage requirement. Moving to `generateAndSaveWeeklySummary` to verify the same pattern holds there.

Checking the weekly summary function - `weekStr` is set as an attribute right at the span's start, before the force-check conditional, which confirms this one is compliant too. The monthly summary function follows the identical structure with `monthStr` set immediately. Now checking `saveDailySummary` for the same pattern.

Adding monthly summary logic...

For `_hasRealSummary`, I'm noting that the original catch block has no error binding, so when I wrap it with span lifecycle tracking I'll need to add a finally block for span.end() even though the original didn't have one—this is a safe addition since it only manages telemetry cleanup.

Now I'm preparing to assemble the full instrumented file as a properly escaped string for the JSON output.


```
