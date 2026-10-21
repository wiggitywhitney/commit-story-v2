# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 10
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 38.3K
- **Output tokens**: 29.5K

## Schema Extensions
- `span.commit_story.summary.check_existing`
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
1. **Attempt 1**: 2 blocking errors (COV-003 (Error Recording):2)
2. **Attempt 2**: 0 errors

## Notes
- COV-003 fix: In readDayEntries, the inner catch for readFile now adds span.recordException and span.setStatus(ERROR) before rethrowing non-ENOENT errors. The ENOENT path returns [] without error recording — that is a graceful expected condition (NDS-007). The outer span-level catch handles any other errors that propagate.
- COV-003 fix: In readMonthWeeklySummaries, the inner catch for readdir now adds span.recordException and span.setStatus(ERROR) before rethrowing non-ENOENT errors. The ENOENT path returns [] gracefully (NDS-007).
- CDQ-007 advisory: Added `if (entries != null)`, `if (summaries != null)`, `if (dailySummaries != null)`, and `if (weeklySummaries != null)` guards before each entries_count setAttribute call. These arrays are always defined in practice but the validator flags unguarded .length access.
- CDQ-007 advisory (filesystem paths): The commit_story.journal.file_path attributes set to summaryPath and path values are filesystem paths. `basename` from node:path is not imported in this file, so per CDQ-007 guidance raw paths are used — adding a new import would violate API-001/NDS-003. This is a known limitation.
- SCH-001 advisories: All ten new span names are for distinct operation classes in the manager/orchestration layer (read-entries, save-file, generate-and-save pipeline). The registry spans flagged as possible duplicates (daily_node, generate_daily, etc.) belong to the LangGraph generator layer. These are different operation classes and the new names should be retained.
- formatDailySummary, formatWeeklySummary, formatMonthlySummary, getWeekBoundaries, and getMonthBoundaries are pure synchronous functions with no I/O — skipped per RST-001.
- _hasRealSummary is an unexported async function with file I/O instrumented as a COV-004 target. Its inner catch is entirely graceful (returns false on all errors, never rethrows), so no error recording is added to it per NDS-007. The span closes via finally.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):28: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):135: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):200: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):345: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):410: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):568: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality):633: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
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
Let me analyze this file and add OpenTelemetry instrumentation according to the schema and rules.

Functions to instrument:
1. `_hasRealSummary` (line 23) - COV-004, async
2. `readDayEntries` (line 42) - COV-001, exported
3. `saveDailySummary` (line 102) - COV-001, exported
4. `generateAndSaveDailySummary` (line 124) - COV-001, exported
5. `readWeekDailySummaries` (line 206) - COV-001, exported
6. `saveWeeklySummary` (line 269) - COV-001, exported
7. `generateAndSaveWeeklySummary` (line 293) - COV-001, exported
8. `readMonthWeeklySummaries` (line 367) - COV-001, exported
9. `saveMonthlySummary` (line 449) - COV-001, exported
10. `generateAndSaveMonthlySummary` (line 472) - COV-001, exported

The helper functions like `formatDailySummary`, `getWeekBoundaries`, `formatWeeklySummary`, `getMonthBoundaries`, and `formatMonthlySummary` don't need spans since they're synchronous with no I/O. Now I'm checking which span names are already defined in the schema versus which ones I need to create. Most of the summary-related spans are already in use by the generators, so I need to assign unique names to the remaining functions in this file, like `commit_story.summary.check_existing` for `_hasRealSummary` and `commit_story.summary.read_day_entries` for `readDayEntries`. I see that `commit_story.journal.file_path` is already registered for the summaryPath parameter, so that's covered. The function returns a boolean, but there's no existing key for that result, so I'd need a new extension attribute if I wanted to track it. The inner try/catch handles file-not-found gracefully and returns false, which means NDS-007 applies and I shouldn't add error recording for that case.

Since the inner catch swallows all errors and returns false, the outer span wrapper won't encounter any exceptions either. I can use Pattern B with a try/finally structure around the span without needing a catch block. I'm weighing whether to add error recording to the inner catch block. Since it's a graceful catch that returns false, NDS-007 suggests I shouldn't record the exception. The safest approach is wrapping with startActiveSpan and using try/finally so all errors are caught gracefully and the span ends properly without needing an outer catch.

Now I'm realizing I need to capture the result of the placeholder check to add it as a span attribute, but since it's a unary NOT operation rather than a direct call expression, I can't use inline return-value capture. I'll need to assign it to a variable first, set the attribute, then return it. Now I'm mapping out the instrumentation for the remaining functions. For `readDayEntries`, I need to capture the date parameter as an ISO string and track the entry count from the result. `saveDailySummary` will use the same date attribute plus the file path, returning either a path or null. And `generateAndSaveDailySummary` follows a similar pattern with the date string conversion.

For the weekly functions, `readWeekDailySummaries` uses the week label and counts the daily summaries found, while `saveWeeklySummary` captures the week label and file path for the summary being saved.

Moving to monthly operations, `readMonthWeeklySummaries` reads the weekly summaries for a given month, registering the month label and the count of summaries, and `saveMonthlySummary` handles saving the monthly summary with the month label registered.

For error handling, I'm noticing that `readDayEntries` has a selective catch block that only gracefully handles file-not-found errors and rethrows everything else, so I'll need to add error recording for those non-ENOENT cases. `saveDailySummary` doesn't have a try-catch at all, which I should account for.

Looking at the other functions, `readWeekDailySummaries` also has a conditional rethrow pattern that needs error tracking, and `readMonthWeeklySummaries` has multiple catch blocks—one for the readdir operation and another for individual file reads, both with conditional rethrows. The remaining functions like `generateAndSaveDailySummary`, `saveWeeklySummary`, `generateAndSaveWeeklySummary`, `saveMonthlySummary`, and `generateAndSaveMonthlySummary` don't have try-catch blocks at all, so I'll need to wrap those in error handling.

For the isRecording guards, simple property accesses like `entries.length`, `summaries.length`, `dailySummaries.length`, and `weeklySummaries.length` don't need guards. For converting the commit story's entry date, I can use the already-imported `getDateString` function or the ISO string split approach—and since entry points are exempt from the guard requirement, calling `getDateString` directly is fine. For the `date` parameter in `readDayEntries`, I need to convert it to an ISO date string for the entry_date field. I'll extract just the date portion using `toISOString().split('T')[0]` to get the YYYY-MM-DD format. Since `date` is a typed Date parameter, calling `toISOString()` on it is safe and doesn't require any guards.

For capturing the entries count, I can set the attribute right before returning the entries array—this adds instrumentation without modifying the existing logic. Similarly, for `saveDailySummary`, I'll set the file_path attribute before returning the computed `summaryPath` variable.

Now I'm working through the full instrumented code, being careful to preserve all existing logic while wrapping function bodies with span creation and adding error recording in catch blocks that rethrow. Let me trace through each function systematically, starting with `_hasRealSummary` where I'll wrap it with a span that captures the summary path and handles the existing try/catch gracefully.

Writing instrumented functions... The catch block handles two paths: ENOENT returns an empty array gracefully, while other errors rethrow. Since NDS-007 says not to record exceptions for graceful error handling, I need to distinguish between these cases—only the rethrow path should get exception recording and error status.

For the span wrapper, I'm applying Pattern B to add an outer catch that handles the error recording requirement from COV-003, wrapping the original try/catch logic.

Writing the span wrapper... The outer catch handles rethrown non-ENOENT errors at the span level, while the inner one gracefully handles ENOENT. For the entries count, that's just a property access so it's exempt from the coverage rules. Now I'm moving on to the `saveDailySummary` function, which starts a span and sets attributes for the date and file path.

Writing function implementation... Finishing up the daily summary function by setting the file path attribute and returning the result with entry count and any errors, then wrapping everything in error handling that records exceptions and ends the span. Now looking at the `readWeekDailySummaries` function, which reads daily summary files and handles missing files gracefully by only rethrowing non-ENOENT errors.

Writing the summary reader... Writing more functions... Completing the weekly summary save operation...

Now I'm implementing the function to read all weekly summaries for a given month, wrapping it in tracing and handling the directory read with a fallback for missing directories, then filtering the files by the weekly summary pattern.

Continuing with the file iteration... Writing more functions... Finishing up the error handling and span lifecycle, then verifying that all the telemetry attributes I'm using are properly registered in the schema. .commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.read_week_summaries`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_month_summaries`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.generate_and_save_monthly`

That gives me 10 new span names total. For the span categories count, I have 0 schema-defined spans since these are all new, 9 service entry points from the exported functions, and 0 external calls being directly spanned since those are handled elsewhere.

Looking at the full function inventory, there are 15 functions in the file total, with 10 of them instrumented (the 9 exported ones plus the internal _hasRealSummary helper), while 5 formatting and boundary-calculation functions are left uninstrumented since they're lightweight utilities.

Now I'm working through the instrumentation rules for _hasRealSummary itself. It's covered by CDQ-006 since it's a COV-004 case, and the summaryPath read is straightforward without needing guards. For COV-003, the inner catch block gracefully returns false, which means all errors are absorbed internally—so there's actually no outer error to record. The finally block still handles span cleanup properly, but the mechanical rule about pairing catch blocks with error recording doesn't apply when the inner catch already handles everything. Wrapping the function with the tracer's span, I'll put the try/catch inside so the inner catch absorbs all errors and the finally block properly ends the span. Since the inner catch handles everything gracefully, there's no need for an outer catch—the span will always be ended.

Now I'm thinking through the date formatting in `readDayEntries` and `saveDailySummary`. I'm currently using `date.toISOString().split('T')[0]` to extract the date portion, but since `getDateString` is already imported and does exactly this, I should use that helper function instead for consistency with how it's used elsewhere in the codebase.

For `generateAndSaveDailySummary`, I need to make sure the `entry_date` attribute gets set early in the function before any early returns, using the computed `dateStr` value that's available right at the start.

I'm also checking the `_hasRealSummary` function and need to verify the comment about "Agent-discovered span" is accurate for what I'm implementing.

Now I'll write out the complete instrumented file, being careful to preserve all the original code while adding the instrumentation attributes in the right places. For `saveDailySummary`, I'll set the attributes after computing `summaryPath` but before any conditional checks.

Writing the complete instrumented file... Adding error handling and span closure... All the new span names fall into the serviceEntryPoints category—nine exported async functions plus one internal async function with I/O operations. The spanCategories breakdown distinguishes between exported entry points, schema-defined spans, and external calls like database or HTTP operations.
```

### Attempt 2

```
The blocking failures are COV-003 at lines 59 and 462. Let me look at what's at those lines.

Line 59 area - this is in `readDayEntries`, the inner try/catch for ENOENT. The validator sees the catch block at line 61 doesn't record error. But this is a graceful catch (ENOENT returns [], non-ENOENT rethrows). The validator is flagging it because it sees a catch block that doesn't have recordException.

Wait, but NDS-007 says don't add recordException to graceful catches. However COV-003 says every catch block that pairs with finally { span.end() } needs error recording.
 
The inner catch at line 61 conditionally rethrows non-ENOENT errors, so the outer catch handles those. The validator is flagging the inner catch because it's inside the span's try block without recordException, even though it's not the span-level catch itself. The validator is flagging this as a coverage issue, but the real problem is that for non-ENOENT errors, I need to record the exception before rethrowing so the outer catch doesn't double-record. I can add error recording and status only on the rethrow path, which satisfies the validator without violating the graceful error handling pattern.

The same fix applies to the inner catch block in `readMonthWeeklySummaries` for the readdir ENOENT case. For the CDQ-007 advisory about filesystem paths, I'd prefer to use basename for safety, but since it's not already imported from `node:path`, I'll keep the raw paths as-is to avoid adding unnecessary imports.

On the `.length` guards, the advisory is flagging entries, summaries, dailySummaries, and weeklySummaries, but these are always initialized as arrays in the function body, so null checks feel over-cautious. Still, to satisfy the advisory, I could add optional chaining or simple `if (entries)` checks even though they're technically unnecessary.

For the path-related advisories, since `basename` isn't imported and the instructions say not to add new non-OTel imports, I'll leave those raw path values as-is. The real priority is fixing the COV-003 blocking issues around error handling in `readDayEntries` and similar functions.

Adding error handling... Adding null guards to length checks...
```
