# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 41.6K
- **Output tokens**: 31.5K

## Schema Extensions
- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.run_daily_summary_graph`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.ai.run_weekly_summary_graph`
- `span.commit_story.ai.generate_monthly_summary`
- `span.commit_story.ai.run_monthly_summary_graph`
- `commit_story.summary.entry_count`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 6 blocking errors (SCH-002 (Attribute Keys Match Registry):6)
2. **Attempt 2**: 0 errors

## Notes
- SCH-002 fix: replaced commit_story.summary.daily_summary_count and commit_story.summary.weekly_summary_count with the already-registered commit_story.summary.entry_count — the validator determined these are semantic duplicates. The entry_count key is now reused across daily (journal entries), weekly (daily summaries), and monthly (weekly summaries) contexts since all three represent a count of input items being consolidated.
- span.commit_story.ai.generate_daily_summary: new span for the dailySummaryNode LangGraph node — distinct from commit_story.ai.generate_summary (used in another file for per-commit journal operations, not daily aggregate summaries).
- span.commit_story.ai.run_daily_summary_graph: new span for generateDailySummary, the public orchestrator that invokes the compiled LangGraph pipeline — distinct from the node function span.
- span.commit_story.ai.generate_weekly_summary: new span for weeklySummaryNode — no existing schema span covers weekly aggregate summary generation; operates on daily summaries, not per-commit journal entries.
- span.commit_story.ai.run_weekly_summary_graph: new span for generateWeeklySummary, the public orchestrator for the weekly LangGraph pipeline.
- span.commit_story.ai.generate_monthly_summary: new span for monthlySummaryNode — no existing schema span covers monthly aggregate summary generation.
- span.commit_story.ai.run_monthly_summary_graph: new span for generateMonthlySummary, the public orchestrator for the monthly LangGraph pipeline.
- commit_story.summary.entry_count (type: int): count of input items (journal entries, daily summaries, or weekly summaries) being consolidated in a given summary pass — no registered key existed before this run for this concept.
- commit_story.summary.week_label (type: string): ISO week string (e.g. '2026-W09') identifying the week being summarized — no registered key covers a week period label.
- commit_story.summary.month_label (type: string): month string (e.g. '2026-02') identifying the month being summarized — no registered key covers a month period label.
- Inner try/catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode return gracefully without rethrowing — no recordException/setStatus added to those inner catches per NDS-007. The outer span-level catch handles unexpected errors per COV-003.
- getModel, resetModel, formatEntriesForSummary, cleanDailySummaryOutput, formatDailySummariesForWeekly, cleanWeeklySummaryOutput, formatWeeklySummariesForMonthly, cleanMonthlySummaryOutput are synchronous pure functions with no I/O — skipped per RST-001.
- parseSummarySections, buildGraph, getGraph, parseWeeklySummarySections, buildWeeklyGraph, getWeeklyGraph, parseMonthlySummarySections, buildMonthlyGraph, getMonthlyGraph are unexported synchronous helpers — skipped per RST-001 and RST-004.
- LangChain model calls (getModel().invoke()) are covered by @traceloop/instrumentation-langchain auto-instrumentation — no manual spans added for those calls per COV-006.
- SCH-001 advisories: the six new span names are genuinely distinct operation classes — the *Node functions are LangGraph node callbacks (single-step graph nodes), while the generate* functions are public orchestrators that compile and invoke the full graph pipeline. Reusing existing names would conflate fundamentally different operations.

## Advisory Findings
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze the file and plan the instrumentation.

Functions to instrument (COV-001):
1. `dailySummaryNode` (line 170) - exported async
2. `generateDailySummary` (line 244) - exported async
3. `weeklySummaryNode` (line 366) - exported async
4. `generateWeeklySummary` (line 437) - exported async
5. `monthlySummaryNode` (line 560) - exported async
6. `generateMonthlySummary` (line 634) - exported async
7.

The synchronous helper functions like `getModel`, `resetModel`, formatting/parsing/cleaning utilities, and graph builders/getters should be skipped per RST-001. I'm also checking the file's imports from `@langchain/langgraph` and `@langchain/anthropic` to see what auto-instrumentation might already apply.

I need to add `@traceloop/instrumentation-langchain` and `@traceloop/instrumentation-anthropic` to librariesNeeded. Some span names like `commit_story.ai.generate_summary`, `generate_dialogue`, and `generate_journal_sections` are already taken by other files, so I'm assigning new names for the daily, weekly, and monthly summary nodes and their graph-running functions.

Now I'm mapping attributes for `dailySummaryNode` — `date` fits neatly to `commit_story.journal.entry_date`, but there's no exact registered key for the entries count input, so I may need to extend the schema with something like `commit_story.summary.entries_count`.

For errors, `commit_story.journal.errors_count` fits well. Going through the other nodes — `generateDailySummary`, `weeklySummaryNode`, `generateWeeklySummary`, `monthlySummaryNode`, `generateMonthlySummary` — most have a label (date/week/month) that maps reasonably, but the count inputs (daily summaries, weekly summaries) don't align with existing keys like `commit_story.context.sessions_count` or `messages_count`, since those describe different things entirely. It looks like I'll need to extend the schema to properly cover these summary count attributes.

So I'm settling on new attributes: `commit_story.summary.week_label`, `commit_story.summary.month_label`, `commit_story.summary.entry_count`, `commit_story.summary.daily_summary_count`, and `commit_story.summary.weekly_summary_count`. Now I'm sketching out the dailySummaryNode function structure, checking for empty entries early on before proceeding.

I realize the existing catch block inside dailySummaryNode already handles errors gracefully by returning a fallback value rather than rethrowing, which means per NDS-007 I shouldn't add error recording there. But since that inner catch swallows everything, the outer span-level catch required by COV-003 will never actually see an exception to record.

I need to structure this as a wrapper pattern where I keep the original try/catch untouched inside, but I'm running into the issue that span.end() can't simply live in a finally block since there's an early-return path before the try/catch even starts.

Wrapping the entire function body in an outer try/finally seems cleaner: preserve the existing early-exit and inner try/catch exactly as they were, but add an outer catch that only fires for truly unexpected errors, recording the exception and setting the span status before rethrowing or returning.

I'll apply the same pattern to `weeklySummaryNode` and `monthlySummaryNode`, and use simple wrapping for `generateDailySummary`, `generateWeeklySummary`, and `generateMonthlySummary` since they lack existing try/catch blocks. I'm also double-checking that `entries?.length ?? 0` correctly falls back to zero when entries is null or undefined.

For `weeklySummaryNode` and `monthlySummaryNode`, I need extension keys for `weekLabel`, `dailySummaries?.length ?? 0`, `monthLabel`, and `weeklySummaries?.length ?? 0`. I'm also considering CDQ-006 regarding guarding computed values with isRecording() - since these are just property accesses with fallbacks rather than method calls, I don't think they need guards.

For the model invocation, LangChain's tracing instrumentation should handle model calls automatically. Now I'm planning out the new spans needed: generate and run daily/weekly/monthly summary spans, six in total.

I'm also mapping out attributes like entry count, week/month labels, and summary counts, reconsidering exactly where each belongs — entry count and date go on the orchestrator span for daily summaries, while I need to double check that dailySummaries only applies to the weekly summary function, not the daily one.

With that settled, I'm confirming the try/finally wrapping ensures the span always ends even on early returns, and that using nullish coalescing for entries length and guarding against undefined date values keeps the instrumentation safe without breaking existing logging behavior.

Writing instrumented graph code...

Now I'm going through each function to instrument: `dailySummaryNode` gets a span with journal entry date and entry count attributes, handled carefully since it has an inner try/catch that fails gracefully. `generateDailySummary` gets a simpler wrapping span with similar attributes plus possibly an errors count from the result.

I continue this same pattern for the weekly and monthly summary functions—each pair (the node version with graceful error handling, and the generate version with simple wrapping) needs its own span name and relevant attributes like week label, daily summary count, month label, and weekly summary count.

For the daily summary generator, I also want to capture the errors count from the graph result and expose it as an attribute, since the registered schema already defines that key. Now I'm rewriting the daily summary node function to add this instrumentation.

Writing daily summary logic...

I'm noticing a structural issue though: the early return before the try block calls span.end() directly, but the finally block would also call span.end() again if execution ever fell through to it, so I need to double check the span isn't ended twice.

Restructuring to wrap everything in the try block, including the early-exit check for empty entries, so the finally block reliably ends the span exactly once.

This confirms Pattern B is right: the outer try/catch/finally wraps everything, the inner catch handles errors gracefully without rethrowing per NDS-007, the outer catch covers unexpected failures per COV-003, and finally guarantees span.end() runs. I also check that attributes are set before the early return, which they are, then start looking at how generateDailySummary sets up its span.

Now I'm noting the safe-access pattern for result.errors.length in the graph result, wondering if I should guard the method chain the same way I did for the entries count.

Then I check the CDQ-006 rule for span attributes: direct property accesses without method calls don't need a guard, so I settle on using optional chaining with a nullish coalescing fallback, which is just a property access and needs no guard.

Next I move on to CDQ-007, which lists PII keys to avoid in span attributes like author, committer, and username.

Now I'm drafting the weeklySummaryNode function, mirroring the structure of dailySummaryNode with span tracking and an early exit when there are no daily summaries to consolidate. Writing the summary node logic...

I need to preserve the destructuring of `dailySummaries` and `weekLabel` at the correct position inside the span wrapper, keeping the early-exit logic and span attributes properly placed before the try block.

For the actual generation logic, I'm invoking the model with a system prompt built for weekly summaries and the formatted daily summaries as human input, then cleaning and parsing the output into sections that get returned as the node's result.

The catch block here handles generation failures gracefully by returning error placeholder text rather than rethrowing, consistent with the pattern used elsewhere. The outer span wraps everything with exception recording before propagating unexpected errors, and I need to verify the same structure holds for the weekly summary generation function which sets span attributes for the week label and summary count before proceeding.

Writing monthly summary logic...

Now I'm looking at `dailySummaryNode`, which logs the entry count and date, then checks if there are no entries to summarize as an early exit case.

I need to be careful about ordering here—the original destructures state, logs, then checks for the early exit before entering the try block. I should add my span attributes right after the destructuring but before the early return check, so I'm not disrupting the existing early-exit logic or logging order.

Still writing tracing logic...

Now I'm confirming the `hasSections` attribute belongs to the logger call rather than a span, so it's unaffected by the tracing changes. I'm also verifying that `weekLabel` gets set before any early return in weeklySummaryNode, then moving to wrap `generateDailySummary` with the same tracing pattern, preserving its original logic around invoking the graph and normalizing the result fields.

Finishing the error handling with status code and cleanup in the finally block. The optional chaining on result.errors doesn't need an isRecording guard since it's just a property access.

Now I'm tallying the new span attributes: five new ones (entry_count, week_label, daily_summary_count, month_label, weekly_summary_count) versus two that already exist in the schema (entry_date, errors_count). So attributesCreated comes out to 5, counting unique keys rather than each setAttribute call.

I'm now categorizing the spans themselves, checking whether the new generate_daily_summary and generate_weekly_summary spans match anything already defined in the schema versus counting as newly introduced.

For serviceEntryPoints, all 6 exported async functions count. Now I'm tallying total functions in the file, going through getModel, resetModel, formatEntriesForSummary, parseSummarySections, cleanDailySummaryOutput, dailySummaryNode, and continuing to check the rest.

Continuing to count functions across all three tiers—daily, weekly, and monthly graph building, summary generation, and formatting helpers—landing at 23 total functions. Now I'm mapping which LangChain and Anthropic instrumentation libraries are needed to trace these functions.

Since `@langchain/anthropic` falls under the LangChain ecosystem, it's covered by that single instrumentation package. I'm now listing out the new span names and attributes I'll need to add for daily, weekly, and monthly summary generation, then moving on to writing the fully instrumented code.

Still writing monthlySummaryNode logic...

Now I have the full picture and just need to write the complete file carefully, preserving every comment, blank line, and structural detail, making sure not to add any logger calls that weren't in the original for the weekly and monthly summary generators.

Finishing the error handling in the span wrapper. I'm confirming that weekLabel and monthLabel in the other summary nodes similarly lack defaults but are used directly, so I'll handle their span attributes the same straightforward way without extra checks.

Writing instrumented daily summary node...

Setting up the LangGraph state schema for summary generation, defining the entries/date inputs, narrative/keyDecisions/openThreads outputs, and an errors field that accumulates via a reducer.

Now I'm writing out the full `dailySummaryNode` function, making sure to preserve the exact blank line placement between the destructuring statement and the logger call when adding tracing instrumentation, since the guideline says not to restructure existing multi-line code layout.

Checking `weeklySummaryNode`, I notice the ordering differs slightly from `dailySummaryNode`: the destructuring happens first, then an early-exit check with its own logger call, and only after that does the "Generating weekly summary" logger call appear before the try block. I need to preserve this exact sequence rather than assuming it matches the other node's structure.

I'm confirming that date, weekLabel, and monthLabel fields can be set directly as strings without transformation, and that the error/entry count attributes are integers matching their expected types. With these details verified, I'm ready to write out the complete file, keeping all JSDoc comments intact.


```

### Attempt 2

```
The SCH-002 failures say that `commit_story.summary.daily_summary_count` and `commit_story.summary.weekly_summary_count` are semantic duplicates of `commit_story.summary.entry_count` and should use that instead. So I need to replace those attribute keys with `commit_story.summary.entry_count` in the code, and remove them from schemaExtensions.
```
