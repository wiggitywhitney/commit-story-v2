# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 3 (fresh-regeneration)
- **Input tokens**: 45.3K
- **Output tokens**: 45.0K

## Schema Extensions
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.weekly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.generate_monthly`
- `commit_story.summary.entries_count`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 9 blocking errors (SCH-002 (Attribute Keys Match Registry):9)
2. **Attempt 2**: 10 blocking errors (SCH-002 (Attribute Keys Match Registry):10)
3. **Attempt 3**: 0 errors

## Notes
- commit_story.summary.entries_count (type: int) — no registered attribute captures the count of source entries being consolidated into a summary. commit_story.context.messages_count is semantically for chat session messages, commit_story.journal.quotes_count is for developer quotes extracted per entry, and commit_story.filter.messages_before/after are for filter operations — none match 'number of entries being fed into a summary generation node'. Declared as a new extension.
- commit_story.summary.week_label (type: string) — no registered attribute captures an ISO week identifier (e.g., '2026-W09'). commit_story.journal.entry_date is YYYY-MM-DD for daily dates; vcs.ref.head.name is a git branch name. Neither is semantically equivalent to a week label. Declared as a new extension.
- commit_story.summary.month_label (type: string) — no registered attribute captures a month identifier (e.g., '2026-02'). Same reasoning as week_label. Declared as a new extension.
- dailySummaryNode, weeklySummaryNode, monthlySummaryNode: the existing inner try/catch blocks swallow errors and return graceful-degradation values without rethrowing (NDS-007). The outer span-level catch is added for COV-003 compliance and handles any unexpected errors that escape the inner catch. In practice the inner catch always fires first for LLM errors.
- getModel, resetModel, formatEntriesForSummary, cleanDailySummaryOutput, formatDailySummariesForWeekly, cleanWeeklySummaryOutput, formatWeeklySummariesForMonthly, cleanMonthlySummaryOutput — all synchronous pure helpers with no I/O, skipped per RST-001.
- parseSummarySections, buildGraph, getGraph, parseWeeklySummarySections, buildWeeklyGraph, getWeeklyGraph, parseMonthlySummarySections, buildMonthlyGraph, getMonthlyGraph — unexported synchronous helpers, skipped per RST-004 and RST-001. Their execution paths are covered by the exported orchestrator spans.
- LangChainInstrumentation (@traceloop/instrumentation-langchain) covers the ChatAnthropic model.invoke() calls made via @langchain/anthropic and the StateGraph.invoke() calls made via @langchain/langgraph. Manual spans are still added to the application-level orchestration functions (COV-001 entry points) so these auto-instrumented LLM calls become child spans within the application trace.
- The previous failed attempt used 'commit_story.journal.entries_count' — rejected because it is not in the registry. The corrected key is 'commit_story.summary.entries_count', placed under the 'summary' category to match the file's domain (summary generation rather than journal entry metadata).

## Advisory Findings
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

## Agent Thinking

### Attempt 1

```
Let me analyze this file and instrument it according to the schema and rules.

Functions to instrument (COV-001 entry points):
1. `dailySummaryNode` (line 170) - async exported
2. `generateDailySummary` (line 244) - async exported
3. `weeklySummaryNode` (line 366) - async exported
4. `generateWeeklySummary` (line 437) - async exported
5. `monthlySummaryNode` (line 560) - async exported
6. `generateMonthlySummary` (line 634) - async exported

Functions to skip (RST-001 sync, RST-004 unexported):
- All the sync functions listed

The file uses LangGraph/LangChain, which are already covered by the LangChainInstrumentation from @traceloop/instrumentation-langchain. I need to create span names for the six async functions following the pattern `commit_story.journal.generate_*` to match the existing schema conventions. Now I'm working through the attributes for each summary node. For the daily summary, I need to map the entry count to a new attribute since the existing `commit_story.context.messages_count` is for session messages, not journal entries. I'll create `commit_story.journal.entries_count` to track how many entries are in each summary period.

For the weekly summary, I'm adding `commit_story.journal.week_label` for the week identifier and `commit_story.journal.daily_summary_count` to track how many daily summaries roll up into each week. The same mappings apply to the generate functions.

For monthly summaries, I'm following the same pattern with `commit_story.journal.month_label` and `commit_story.journal.weekly_summary_count`.

Now I'm looking at the error handling in these functions. The daily summary has a try/catch that returns a default value instead of rethrowing, which is graceful degradation, so I shouldn't add exception recording inside that original catch block. I need to be careful about how I wrap this with span instrumentation. the inner try/catch stays in place, but I'm wrapping everything with an outer span that catches any unexpected errors outside the original error handling. The original function's inner catch doesn't rethrow, so the outer catch would only trigger for errors in the setup code or other operations that aren't already handled—that's the key distinction here. The outer catch would only trigger if destructuring or the logger call fails, which is unlikely but I'll add error recording per COV-003 anyway. For the weekly and monthly summary nodes, the same pattern applies with inner catches handling errors gracefully. The three generate functions lack try/catch blocks entirely, so I'll wrap those normally. For CDQ-006 attribute guards, simple property accesses like `entries.length` don't need the isRecording guard—only the logger's optional chaining in the info call can skip it.

Now I'm checking PII concerns: `date`, `weekLabel`, and `monthLabel` are all safe to log. The LangGraph and LangChain imports will be covered by the existing instrumentation. I need to declare the schema extensions for the span attributes and the new metrics I'm tracking.

Writing instrumented code... weekly_summary_count - NEW

So I'm identifying five new attribute keys that need to be added to the schema: entries_count, week_label, daily_summary_count, month_label, and weekly_summary_count, while entry_date already exists. Looking at the `dailySummaryNode` function, I need to set the span attributes for `entry_date` and `entries_count` before the early-return guard that checks if entries exist. Since entries could be null or undefined, I'll use optional chaining with a nullish coalescing fallback to safely get the length. Setting up the instrumented file with careful attention to preserve all original code and handle error recording properly through the outer span wrapper catch block. Writing the instrumented file... Writing the summary graphs... Continuing the span, I'm handling the case where there are no entries by returning early with a default response, then moving into the main logic where I format the entries, invoke the model with a system prompt and the formatted data, clean up the response, and parse it into sections while logging the results. Adding span attributes... Writing the weekly summary logic... Setting up error handling and span completion... Continuing the monthly summary node...

I'm cleaning up the model's response and parsing it into the distinct sections, then returning the structured monthly summary with accomplishments, growth insights, and forward-looking items. If anything fails during generation, I catch the error and return a fallback response with an error message recorded. Finishing the error handling and span lifecycle management, then I'm analyzing the span categories across the file to understand what's been instrumented—counting the service entry points, checking which span names were predefined in the schema, and identifying external calls that might need additional instrumentation. Continuing with the remaining summary functions for weekly and monthly aggregation, plus some new attribute keys being added to track journal metadata like entry counts and time period labels. New extension needed for `commit_story.journal.month_label`. Before writing the complete JSON response, I'm verifying the optional chaining in `entries?.length ?? 0` doesn't need an isRecording guard since it's just a property access with a default value. For `weekLabel`, I should add a fallback to handle cases where it might be undefined from the state, setting the attribute with an empty string if needed. Being defensive with nullish coalescing won't hurt. Now I'm compiling the schema extensions list, which includes the six new span names for the daily, weekly, and monthly summary nodes and their generation functions, plus the attribute keys like entries count that track what's being processed.

Writing instrumented code...
```

### Attempt 2

```
The validation errors are SCH-002 failures. The registry now shows these attributes ARE registered:
- `commit_story.journal.entries_count` (already in registry)
- `commit_story.journal.month_label` (already in registry)

And the validator says:
- `commit_story.journal.week_label` is a semantic duplicate - but looking at the registry list, I don't see it listed. Wait, the validator says "declared attribute extension 'commit_story.journal.week_label' is a semantic duplicate" but doesn't say what it's a duplicate of. Looking at the registry list shown: it's NOT in the shown 30 attributes, but the registry has 40 total. 

So it seems like `week_label` was registered in a previous run. The validator is flagging three attributes as semantic duplicates: `week_label` (of something already registered), and both `daily_summary_count` and `weekly_summary_count` (which are duplicates of `entries_count`). The line-level failures indicate these attributes aren't found in the registry, so I either need to add them to schemaExtensions or use the existing registered keys instead. I'm realizing the validator might have already processed my previous schema extensions and added them to the registry, which would explain why `commit_story.journal.entries_count` now appears as registered even though I just declared it. The contradiction between the "not found" and "semantic duplicate" errors suggests the validator is checking against an updated registry that includes my extension declarations from the prior run. run, just not shown in the top 30). I should use it directly without re-declaring it. For the summary counts, the validator flagged `daily_summary_count` and `weekly_summary_count` as semantic duplicates of `entries_count`, so I need to replace those references throughout the code and use `entries_count` instead.

Now I'm cleaning up the schemaExtensions to remove all the field extensions that are already registered in the schema, keeping only the span name extensions for the various summary nodes and generation functions. The remaining attributes stay registered and just get removed from schemaExtensions, leaving only the six span names there. The advisory warnings about duplicate span names are acceptable since they represent genuinely different operations at different granularities, so I'll keep my naming choices and note the distinction.
```

### Attempt 3

```
Let me analyze the file and instrument it properly. The previous attempt failed because it used `commit_story.journal.entries_count` which isn't in the registry.

Let me identify what spans to add:
1. `dailySummaryNode` (line 170) - COV-001 entry point
2. `generateDailySummary` (line 244) - COV-001 entry point
3. `weeklySummaryNode` (line 366) - COV-001 entry point
4. `generateWeeklySummary` (line 437) - COV-001 entry point
5. `monthlySummaryNode` (line 560) - COV-001 entry point
6. `generateMonthlySummary` (line 634) - COV-001 entry point

I need to create new span names for the daily, weekly, and monthly summary functions since the schema already has entries for generate_summary, generate_sections, generate_dialogue, and generate_technical_decisions. I'll use distinct names that follow the existing naming convention.

For the span names, I'm mapping them to the corresponding functions: daily_node and generate_daily for the daily summary, weekly_node and generate_weekly for weekly, and monthly_node and generate_monthly for monthly. For attributes, I'll leverage the registered keys already available in the schema like commit_story.context.messages_count for message counts, commit_story.journal.entry_date for dates, and the gen_ai keys for model configuration and operation details.

Now I'm working through the daily summary node inputs. The date maps cleanly to commit_story.journal.entry_date, but for the entries count I'm running into a gap—commit_story.context.messages_count is specifically for messages from sessions, not journal entries. I need to find or create the right attribute for tracking how many entries are being processed in the summary.

Looking at the existing registry, nothing semantically matches "number of journal entries being summarized," so I'll need to declare a new attribute using the summary namespace: commit_story.summary.entries_count. This follows the pattern I'm seeing where the structure is commit_story.<category>.<name>.

Now I'm mapping attributes across the different summary nodes. For dailySummaryNode, I'll use commit_story.journal.entry_date for the date input and the new entries_count attribute. For weeklySummaryNode, I need a week_label attribute and should probably use daily_summaries_count to be more specific about what's being counted. The monthlySummaryNode will follow a similar pattern with a month_label attribute. I'm settling on a minimal set of attributes to avoid rejection: `entries_count` for the number of entries being processed, `week_label` and `month_label` for the period identifiers, and `period_type` to distinguish between daily, weekly, and monthly summaries.

For the `dailySummaryNode` error handling, I need to wrap the existing try/catch in a span-level try/catch to satisfy the observability requirements—the outer catch will only trigger if something outside the inner try/catch throws, allowing the function's graceful degradation to remain intact while still recording exceptions at the span level.

The other summary functions don't have existing try/catch blocks, so they're straightforward to instrument with span wrapping. Now I'm checking whether there's auto-instrumentation available for `@langchain/langgraph` in the allowlist.

I found that `langchain` and `@langchain/*` map to `LangChainInstrumentation` from the traceloop library, so I need to add that to the libraries list. Since `@langchain/anthropic` provides `ChatAnthropic` which wraps Anthropic, it should be covered by the same instrumentation.

Now I'm writing the instrumented code, being careful to preserve existing logic, use the correct attribute names, add `isRecording()` guards for method calls on values, and access input parameters before any early returns. For the daily summary node, I'm setting the entry date directly from state and then moving on to other attributes. Now I'm setting up the instrumentation file with the OpenTelemetry tracer and mapping the node functions to schema-defined span names like `commit_story.summary.daily_node` and `commit_story.summary.generate_daily`.

Writing instrumented functions... Writing function logic... Writing the instrumented file... Now I'm mapping out which attributes to set for each summary generation function—the daily summaries will track entry counts and dates, weekly summaries will include week labels and daily summary counts, and monthly summaries will have month labels with weekly summary counts. doesn't count as a new attribute since it's already registered. So `attributesCreated` should be 3, representing the three new summary attributes we're introducing to the schema. So the three new attributes are `commit_story.summary.entries_count`, `commit_story.summary.week_label`, and `commit_story.summary.month_label`, which get called 6, 2, and 2 times respectively across the different summary nodes and generation functions—that's 10 total new attribute calls, though I need to clarify whether we're counting distinct keys or total calls. So `attributesCreated` should be 10—the total setAttribute calls using non-schema keys across all the summary nodes. Now I need to write out the complete instrumented file, making sure the attribute assignments for `dailySummaryNode` don't need guards since they're just property access and nullish coalescing without function calls.

Writing the instrumented file... Writing the instrumented function... I'm realizing the issue with Pattern A here—there's code before the try/catch that would execute outside the span, so I can't simply wrap the existing try/catch as the outer handler. I need to reconsider whether the early return should be inside or outside the span's scope.

Pattern B wraps everything in a new try/finally, which ensures the early return still triggers span.end() through the finally block. The existing inner catch handles all errors gracefully without throwing, so the outer catch would theoretically never fire. But COV-003 requires error recording on the catch paired with span.end(), so I need to add that even if it's unreachable.

Writing span wrapper code... Writing error handling...

Now I'm compiling the schema extensions for the tracing spans and attributes across the daily, weekly, and monthly summary generation functions. I'm counting up the remaining functions in the file—looks like there are 23 total across all the daily, weekly, and monthly summary operations. I need to add LangChain instrumentation to handle the imports, then write out the complete instrumented file while keeping every original line intact.

Writing instrumented code... The optional chaining with the nullish coalescing operator handles the null/undefined case properly, so no additional guard is needed. Now I'll write out the complete file with all the imports and function implementations.
```
