# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.2K
- **Output tokens**: 40.4K
- **Cached tokens**: 25.0K

## Schema Extensions
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.weekly_summary_node`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.generate_monthly_summary`
- `commit_story.journal.entries_count`
- `commit_story.summary.week_label`
- `commit_story.summary.daily_summaries_count`
- `commit_story.summary.month_label`
- `commit_story.summary.weekly_summaries_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- All six schema-defined journal span names (commit_story.journal.summary_node, commit_story.journal.technical_node, commit_story.journal.dialogue_node, commit_story.journal.generate_sections) were already declared by earlier files in this run. New span names were invented following the commit_story.journal.* naming convention.
- dailySummaryNode, weeklySummaryNode, and monthlySummaryNode each have a catch block that returns a fallback object without rethrowing — these are graceful-degradation catches (NDS-007). recordException and setStatus(ERROR) were NOT added to them. The LLM invocation failures are captured in the errors state field rather than as span errors. span.end() is placed in the finally block of the existing try/catch so the span closes on both success and graceful-error paths.
- generateDailySummary, generateWeeklySummary, and generateMonthlySummary had no existing try/catch blocks; a standard try/catch/finally wrapper with recordException and setStatus(ERROR) was added per COV-003.
- commit_story.journal.entries_count (int) is a new extension — no registered key matches 'count of journal entries being summarized'. commit_story.context.messages_count is semantically distinct (messages collected from Claude Code sessions, not journal entries for daily summary input). commit_story.journal.word_count (registered) represents output word count, not input entry count.
- commit_story.summary.week_label (string) and commit_story.summary.daily_summaries_count (int) are new extensions under the commit_story.summary category — no registered key covers an ISO week label or a count of daily summaries as input to weekly generation. commit_story.context.time_window_start/end cover time windows, not week identifiers.
- commit_story.summary.month_label (string) and commit_story.summary.weekly_summaries_count (int) are new extensions — no registered key covers a month label (e.g., '2026-02') or a count of weekly summaries as input to monthly generation.
- @langchain/langgraph, @langchain/anthropic, and @langchain/core/messages all fall under the @langchain/* auto-instrumentation coverage of @traceloop/instrumentation-langchain. The graph.invoke() and getModel().invoke() LLM calls will produce child spans under the manual entry-point spans added here.
- getModel, resetModel, formatEntriesForSummary, cleanDailySummaryOutput, formatDailySummariesForWeekly, cleanWeeklySummaryOutput, formatWeeklySummariesForMonthly, cleanMonthlySummaryOutput are synchronous pure transformations with no I/O — skipped per RST-001.
- parseSummarySections, parseWeeklySummarySections, parseMonthlySummarySections, buildGraph, getGraph, buildWeeklyGraph, getWeeklyGraph, buildMonthlyGraph, getMonthlyGraph are unexported synchronous functions — skipped per RST-004 (exported orchestrators cover their execution paths) and RST-001 (no I/O).

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
Let me analyze the file and instrument it according to the schema and rules.

Functions to instrument (COV-001):
1. `dailySummaryNode` (line 170) - exported async
2. `generateDailySummary` (line 244) - exported async
3. `weeklySummaryNode` (line 366) - exported async
4. `generateWeeklySummary` (line 437) - exported async
5. `monthlySummaryNode` (line 560) - exported async
6. `generateMonthlySummary` (line 634) - exported async

Span names from schema (already used by other files):
- `commit_story.journal.summary_node` and `commit_story.journal.generate_sections` are already claimed. Checking the schema more closely, all the journal-namespace spans defined there (dialogue_node, generate_sections, summary_node, technical_node) are already taken by other files, so I'll need to invent new span names under the `commit_story` namespace for these six functions.

I'm mapping out names like `commit_story.journal.daily_summary_node`, `generate_daily_summary`, `weekly_summary_node`, `generate_weekly_summary`, `monthly_summary_node`, and `generate_monthly_summary`. Now I'm working through the attributes for dailySummaryNode, figuring out that `date` should map to `commit_story.journal.entry_date` and reconsidering how to handle the entries count since that's distinct from the message count field.

Since there's no existing schema match, I'll declare a new extension key like `commit_story.journal.entries_count`, and for `hasSections` I could add `commit_story.journal.has_sections` as a boolean extension, keeping in mind the minimum threshold requires at least one attribute. I'm now setting the input attributes—entries and date—before the guard clause for dailySummaryNode.

Now I'm working through the remaining functions, setting entry_date and entries_count attributes before their respective guards in generateDailySummary, then moving to weeklySummaryNode where I need week_label and daily_summary_count attributes, possibly as extensions too.

Since none of the registered attributes capture week/month labels or summary counts, I'll settle on extension keys: entries_count for daily journal entries, week_label and daily_summaries_count for weekly summaries, and month_label with weekly_summaries_count for monthly summaries.

Checking the LangChain imports against the auto-instrumentation allowlist, `@langchain/*` packages are covered by the LangChainInstrumentation, so those calls don't need manual span instrumentation.

Now I'm examining the existing try/catch structure in each node function. The dailySummaryNode's catch block returns a default value instead of rethrowing, which makes it a graceful-degradation catch that shouldn't get recordException/setStatus treatment, though I need to think through what the outer span wrapper's catch should do differently.

I'm seeing a real tension here: COV-003 wants every span's paired catch to record errors, while NDS-007 says graceful degradation catches that swallow and return normally shouldn't get recordException added. I need to reconcile these—likely NDS-007 takes precedence for catches that don't rethrow, since there's no actual exception propagating to worry about.

So my approach is to keep the try/catch structure unchanged and only add `finally { span.end() }`, leaving the catch body without error recording since it's a graceful degradation case. I'll apply this same reasoning to `weeklySummaryNode`, `monthlySummaryNode`, and the summary generation functions.

For functions like `generateDailySummary` that lack try/catch entirely, I'll wrap them in a full try/catch/finally that records the exception, sets error status, rethrows, and ends the span in finally. Now I'm working through what attributes each summary node needs — for instance, setting entry date and entry count attributes before any early-return guard in `dailySummaryNode`, and thinking through equivalent attributes for `weeklySummaryNode`.

On reflection, that's just a cheap property access with a fallback, so no isRecording() guard is needed there. Now I'm moving to writing out the fully instrumented file, making sure to carefully account for every export as I reconstruct it.

Writing instrumentation attributes...

I'm figuring out which attributes to attach to each span—setting the journal entry date and entries count before the early return in dailySummaryNode, and doing the same inside generateDailySummary, making sure the early exit guard still works properly within the span.

Adding error handling with span.end() in a finally block, keeping the original catch behavior without recordException. I'm making sure the destructuring stays inside the span so I can set attributes right after it.

I'm invoking the model with the formatted entries, then cleaning and parsing the output into narrative, key decisions, and open threads sections, returning them with error handling and span cleanup in a finally block.

This is a graceful degradation catch since it returns a fallback value instead of rethrowing, so it doesn't need exception recording. I also confirm the `entries?.length ?? 0` attribute always resolves to a number since the nullish coalescing handles the undefined case from optional chaining.

Adding exception recording and finally-block span closure, then moving to instrument weeklySummaryNode with an early-exit guard for empty daily summaries, logging, and graceful error degradation.

Same pattern applies to the monthly summary node, and I'm applying the same tracing wrapper to `generateWeeklySummary`, which invokes the graph with daily summaries and week label, then extracts the result fields like week-in-review, highlights, patterns, and errors.

Still writing summary generation logic...

Now I'm checking that the LangChain-related imports (langgraph, anthropic, core/messages) fall within the allowed package list.

I'm also considering whether `weekLabel` from state could be undefined when passed to `setAttribute`, but since it's a required state field and null checks aren't supposed to be added for non-optional property access, I'll leave it as is.

Now I'm tallying up the new attributes: entries_count, week_label, daily_summaries_count, month_label, and weekly_summaries_count—five new extensions total, alongside the existing entry_date attribute, and starting to categorize the spans by type.

Continuing the count through all the weekly and monthly summary functions, I land on 23 total functions in the file. I also note that the optional chaining with nullish coalescing on entries.length safely defaults to 0 when entries is null or undefined.

Now I'm starting to write out the full instrumented file, beginning with the header comments explaining the LangGraph StateGraphs setup for daily, weekly, and monthly summary generation.

Defining state schema and model cache...

Writing the entry formatter...

I'm adding a function that numbers and joins journal entries into a labeled block for the summary prompt, then starting a parser to extract the Narrative, and other sections from the LLM's response.

Finishing the parser logic, I fall back to putting everything into narrative if no headers were found, then move on to the post-processing step for cleaning daily summary output, stripping preamble and swapping out formal words using the same banned list as journal-graph.

Adding more word replacements...

Now I'm writing a function that applies all the banned-word replacements to raw text, then strips any preamble before the "## Narrative" heading and trims the result, falling back to the original if empty. After that I'm starting to define the daily summary generation node that reads journal entries and produces a consolidated summary within a tracing span.

For the node itself, I check if there are no entries and short-circuit with a "no entries found" message. Otherwise, I build the prompt, format the entries, and invoke the model with a system message and the formatted entries as a human message.

After getting the result, I clean the output and parse it into sections, then log whether sections were successfully extracted, returning the narrative, key decisions, and open threads. If anything fails, I catch the error and return placeholder text with an error message, making sure to end the span in a finally block regardless of outcome.

Now I'm setting up the graph builder, defining a simple single-node pipeline that flows from start to the daily summary generation node and then to end, compiling it lazily and caching the compiled graph for reuse.

I'm writing the exported function that runs this graph, wrapping the invocation in a tracing span with attributes for the date and entry count, logging progress, invoking the graph with entries and date, and returning the narrative, key decisions, and open threads from the result with sensible fallbacks.

Still writing span wrapper...

Now I'm moving on to instrumenting `weeklySummaryNode`, starting from its original definition.

For this function, I need to handle the case where there are no daily summaries to consolidate, returning an early exit message. Otherwise, I build the weekly prompt, format the daily summaries for the LLM, and invoke the model with a temperature of 0.7 to generate the consolidated week-in-review.

Once I get the response, I'll clean the output and parse it into sections, returning the week-in-review, highlights, and patterns; if anything fails, I catch the error and return failure messages for each section. I also notice this function needs to be wrapped in a tracing span, so I'm adding that instrumentation around the whole node.

Finishing invoking the model with the formatted summaries, then cleaning the output and parsing it into sections before returning the week-in-review, highlights, and patterns, with a catch block handling generation failures gracefully.

Finishing the error handling wrap-up, I'm now moving to instrument `monthlySummaryNode`, starting with its early exit check for when there are no weekly summaries to consolidate.

Otherwise, it builds the prompt and formats the weekly summaries, invokes the model at temperature 0.7, then cleans and parses the output into structured sections to return.

If generation fails, I catch the error and return a fallback response marking the month-in-review as failed while capturing the error message. Then I'm adding tracing instrumentation to wrap this node in a span that records the month label as an attribute.

Now I'm handling the case where there are no weekly summaries to consolidate—logging and returning empty placeholder fields early rather than proceeding. Otherwise I'm building the prompt from the weekly summary count, formatting the summaries, and invoking the model to generate the consolidated monthly summary.

Now I'm wrapping the same function in a tracing span, adding attributes for the month label and weekly summaries count before running the same try/catch logic to build the result object with fallback empty strings and a generatedAt timestamp.

I'm noting the LangChain packages needed for this instrumentation: @langchain/langgraph and @langchain/anthropic.

Now I'm drafting the schema extensions needed—new spans for the daily, weekly, and monthly summary nodes and their generation steps, plus attributes like entry counts to track journal data.

With the schema mapped out, I'm tallying the new attributes (5 total) and span categories: zero external calls, no unused schema-defined spans, six service entry points, and 23 total functions in the file. Now I'm ready to write out the fully instrumented file.

So the total count comes to 5 new attributes, since `entry_date` is already registered and doesn't count. Now I'm noting that the three summary node catch blocks intentionally skip `recordException` and `setStatus(ERROR)` per NDS-007, since LLM failures are tracked via the `errors` state field rather than span errors, and I'm confirming `span.end()` sits in a finally block.

LangChain's own imports are already covered by the Traceloop auto-instrumentation package, so the graph and LLM invoke calls will show up as child spans automatically. I'm also noting the new `commit_story.summary` namespace covers week/month labels since no existing schema keys handle those for summary spans, while `entry_date` still covers the daily case.

For entry counts, none of the registered keys fit "number of journal entries being summarized" — messages_count and word_count both mean something different — so I'll extend the schema. Now I'm ready to write out the fully instrumented file carefully, watching the formatting closely.


```
