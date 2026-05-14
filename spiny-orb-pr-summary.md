## Summary

- **Files processed**: 30
- **Committed**: 13
- **Correct skips**: 17

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.14 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 1 | $0.12 | — | `span.commit_story.git.get_commit_data`, `span.commit_story.git.get_previous_commit_time` |
| src/commands/summarize.js | success | 3 | 1 | $0.20 | — | `span.commit_story.summarize.run_summarize`, `span.commit_story.summarize.run_weekly_summarize`, `span.commit_story.summarize.run_monthly_summarize`, `commit_story.summarize.dates_count`, `commit_story.summarize.weeks_count`, `commit_story.summarize.months_count`, `commit_story.summarize.force`, `commit_story.summarize.generated_count`, `commit_story.summarize.failed_count` |
| src/generators/journal-graph.js | success | 4 | 2 | $0.59 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.generate_sections`, `span.commit_story.journal.generate_summary`, `span.commit_story.journal.generate_technical`, `span.commit_story.journal.generate_dialogue` |
| src/generators/summary-graph.js | success | 6 | 2 | $0.63 | `@traceloop/instrumentation-anthropic`, `@traceloop/instrumentation-langchain` | `span.commit_story.summary.daily_node`, `span.commit_story.summary.generate_daily`, `span.commit_story.summary.weekly_node`, `span.commit_story.summary.generate_weekly`, `span.commit_story.summary.monthly_node`, `span.commit_story.summary.generate_monthly`, `commit_story.summary.entries_count`, `commit_story.summary.week_label`, `commit_story.summary.month_label` |
| src/index.js | success | 1 | 2 | $0.57 | — | `span.commit_story.cli.main` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.14 | — | `span.commit_story.context.gather_context` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.15 | — | `span.commit_story.summarize.trigger_auto_summaries`, `span.commit_story.summarize.trigger_auto_weekly`, `span.commit_story.summarize.trigger_auto_monthly` |
| src/managers/journal-manager.js | success | 2 | 2 | $0.39 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | success | 9 | 1 | $0.35 | — | `span.commit_story.summary.read_day_entries`, `span.commit_story.summary.save_daily`, `span.commit_story.summary.generate_and_save_daily`, `span.commit_story.summary.read_week_daily_summaries`, `span.commit_story.summary.save_weekly`, `span.commit_story.summary.generate_and_save_weekly`, `span.commit_story.summary.read_month_weekly_summaries`, `span.commit_story.summary.save_monthly`, `span.commit_story.summary.generate_and_save_monthly` |
| src/mcp/server.js | success | 1 | 2 | $0.23 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.server_start`, `commit_story.mcp.transport`, `commit_story.mcp.server_name` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.07 | — | `span.commit_story.journal.ensure_directory` |
| src/utils/summary-detector.js | success | 5 | 2 | $0.41 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `span.commit_story.summary.find_unsummarized_months` |

**Correct skips** (17 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 |
| src/collectors/git-collector.js | 0 | 0 | 2 | 6 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 |
| src/generators/prompts/guidelines/accessibility.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/guidelines/anti-hallucination.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/sections/dialogue-prompt.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/sections/technical-decisions-prompt.js | 0 | 0 | 0 | 0 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 19 |
| src/index.js | 0 | 0 | 1 | 9 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/managers/summary-manager.js | 0 | 0 | 9 | 13 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/traceloop-init.js | 0 | 0 | 0 | 0 |
| src/utils/config.js | 0 | 0 | 0 | 0 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.mcp.server_name
- commit_story.mcp.transport
- commit_story.summarize.dates_count
- commit_story.summarize.failed_count
- commit_story.summarize.force
- commit_story.summarize.generated_count
- commit_story.summarize.months_count
- commit_story.summarize.weeks_count
- commit_story.summary.entries_count
- commit_story.summary.month_label
- commit_story.summary.week_label




### Span Extensions (39)

- `span.commit_story.cli.main`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.save_entry`
- `span.commit_story.mcp.server_start`
- `span.commit_story.summarize.run_monthly_summarize`
- `span.commit_story.summarize.run_summarize`
- `span.commit_story.summarize.run_weekly_summarize`
- `span.commit_story.summarize.trigger_auto_monthly`
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.generate_and_save_monthly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.generate_monthly`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.weekly_node`

## Review Attention

- **src/generators/summary-graph.js**: 6 spans added (average: 2) — outlier, review recommended
- **src/managers/summary-manager.js**: 9 spans added (average: 2) — outlier, review recommended
- **src/utils/summary-detector.js**: 5 spans added (average: 2) — outlier, review recommended

### Advisory Findings

- **SCH-004 (No Redundant Schema Entries)** (src/commands/summarize.js): Attribute key "commit_story.summarize.force" at line 193 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'gen_ai.request.max_tokens' instead. The attribute 'commit_story.summarize.force' appears to control token limits or constraints for the summarization operation, which semantically aligns with the GenAI semantic convention for maximum token request parameters. While it is in the commit_story domain, it measures the same concept (token constraint for generation) as gen_ai.request.max_tokens.
- **SCH-004 (No Redundant Schema Entries)** (src/commands/summarize.js): Attribute key "commit_story.summarize.failed_count" at line 260 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Consider using a registered attribute key that better represents the failure concept. If tracking AI operation failures, use 'gen_ai.operation.name' combined with appropriate status/error attributes. If this is application-domain tracking of summarization failures within commit_story, consider standardizing to a pattern like 'commit_story.summarize.error_count' or 'commit_story.summarize.failures' that aligns with existing commit_story naming conventions (e.g., 'commit_story.journal.quotes_count', 'commit_story.context.messages_count'). Alternatively, if this tracks usage metrics, align with the 'gen_ai.usage.*' pattern.
- **SCH-004 (No Redundant Schema Entries)** (src/commands/summarize.js): Attribute key "commit_story.summarize.months_count" at line 350 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'commit_story.context.time_window_start' and 'commit_story.context.time_window_end' to represent the months_count concept, or add a more specific attribute like 'commit_story.summarize.time_window_months' if a distinct months duration metric is required.
- **SCH-004 (No Redundant Schema Entries)** (src/generators/summary-graph.js): Attribute key "commit_story.summary.month_label" at line 605 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use 'commit_story.summarize.months_count' instead. The attribute 'commit_story.summary.month_label' appears to be a semantic duplicate measuring month-related summary data. The existing key 'commit_story.summarize.months_count' already captures month aggregation in the summarize domain. If a label/name is needed rather than a count, consider 'commit_story.summarize.month_label' (correcting the domain namespace from 'summary' to 'summarize' for consistency with related attributes like 'commit_story.summarize.dates_count').
- **NDS-005 (Control Flow Preserved)** (src/index.js): NDS-005: Original try/catch block (line 490) is missing from instrumented output. Instrumentation must preserve existing error handling structure — do not remove or merge try/catch/finally blocks. Judge assessment (confidence 95%): semantics not preserved. Restore the original try/catch block structure from line 490. Do not remove, merge, or restructure error handling blocks. Preserve all catch clauses in their original order, maintain re-throw behavior, and ensure all exception types are caught exactly as in the original code. If instrumentation code is needed, add it within the existing try/catch blocks without altering their structure.
- **CDQ-006 (isRecording Guard)** (src/managers/journal-manager.js): setAttribute value "commit.timestamp.toISOString().split('T'..." at line 187 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- **CDQ-006 (isRecording Guard)** (src/managers/summary-manager.js): setAttribute value "getDateString(date)" at line 33 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/context-capture-tool.js): "saveContext" (async function) at line 69 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/context-capture-tool.js): "registerContextCaptureTool" (contains await) at line 87 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/reflection-tool.js): "saveReflection" (async function) at line 65 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/reflection-tool.js): "registerReflectionTool" (contains await) at line 83 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **CDQ-008 (Tracer Naming)** ((run-level)): All tracer names follow a consistent naming pattern.

## Agent Notes

**src/collectors/claude-collector.js**:
- span.commit_story.context.collect_chat_messages is a new span name — no matching span was found in the registry schema. It follows the namespace convention and captures the top-level claude context collection operation.
- getClaudeProjectsDir, encodeProjectPath, getClaudeProjectPath were skipped: all are pure synchronous functions (RST-001 (No Utility Spans)/RST-002 (No Trivial Accessor Spans)/RST-003 (No Thin Wrapper Spans)) — they perform only path computation or existsSync checks and are called from within the collectChatMessages span.
- findJSONLFiles and parseJSONLFile are exported sync I/O functions but are called in a loop from collectChatMessages. Per RST-004 (No Internal Detail Spans) spirit, the orchestrating parent span covers their execution paths; adding spans to each would create noise in high-volume loops without diagnostic benefit.
- *... 2 more notes in reasoning report*

**src/collectors/git-collector.js**:
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are unexported internal helpers — skipped per RST-004 (No Internal Detail Spans). Their I/O operations become child work within the exported orchestrator spans via context propagation.
- getCommitData sets commit_story.commit.message to metadata.subject (the commit subject line), which matches the schema definition of 'the first line of the commit message'.
- metadata.timestamp is a Date object — converted to ISO string via .toISOString() before setAttribute to satisfy CDQ-007 attribute type safety.
- *... 1 more notes in reasoning report*

**src/commands/summarize.js**:
- Skipped isValidDate (unexported, pure sync), isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs (all exported but pure synchronous with no I/O), and showSummarizeHelp (sync, side-effect-only console call) per RST-001 (No Utility Spans)/RST-004 (No Internal Detail Spans).
- The per-date/week/month catch blocks inside the loops are expected-condition catches — they accumulate failures into the result without rethrowing. These do NOT get recordException/setStatus added per the expected-condition exception rule; the outer span-level catch handles unexpected throws.
- The empty catch block around `access(summaryPath)` is a control-flow catch (file-not-found detection) and was left untouched.
- *... 2 more notes in reasoning report*

**src/generators/journal-graph.js**:
- Removed gen_ai.usage.input_tokens and gen_ai.usage.output_tokens attribute guards — the if-blocks around optional chaining were flagged as non-instrumentation lines by NDS-003 (Code Preserved). These recommended attributes are omitted since they cannot be safely set without guards that the validator rejects.
- Fixed a spurious extra closing brace in the formatChatMessages template literal that was introduced in the previous pass.
- Node functions (summaryNode, technicalNode, dialogueNode) are declared without the export keyword but are exported via the bottom export block, so RST-004 (No Internal Detail Spans) does not apply. They are instrumented per COV-004 (Async Operation Spans) since all three are async sibling functions with the same structure.
- *... 1 more notes in reasoning report*

**src/generators/summary-graph.js**:
- Removed all if-guards around setAttribute calls to fix NDS-003 (Code Preserved) failures. The validator treats guard conditionals as non-instrumentation lines. Values like date, weekLabel, monthLabel, entries.length, dailySummaries.length, and weeklySummaries.length are passed directly; ternary expressions (e.g. entries ? entries.length : 0) are used inline within setAttribute to avoid adding separate conditional statements.
- The catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode perform graceful returns (no re-throw) — they capture errors into the LangGraph state errors array rather than propagating exceptions. Per the expected-condition catches rule, recordException and setStatus(ERROR) were NOT added to these catches.
- commit_story.summary.entries_count is a new attribute because no registered key captures the number of journal entries input to a single-day summary. commit_story.summarize.generated_count tracks generated output counts in batch runs, not input entry counts for a single invocation.
- *... 2 more notes in reasoning report*

**src/index.js**:
- NDS-003 (Code Preserved) fix: removed the `if (context.chat !== undefined)` guard and the commit_story.context.messages_count setAttribute call. context.chat is optional (accessed with ?. in the adjacent debug call), so setting the attribute safely required a guard that the validator treats as non-instrumentation code. The attribute is dropped to avoid both NDS-003 (Code Preserved) and CDQ-007 violations. The span retains vcs.ref.head.revision and commit_story.journal.file_path attributes.
- span.commit_story.cli.main is a new schema extension — no existing schema span matches the CLI main() entry point orchestration role.
- handleSummarize() is unexported and covered by main()'s span per RST-004 (No Internal Detail Spans). The COV-004 (Async Operation Spans) advisory is acknowledged but RST-004 (No Internal Detail Spans) takes precedence.
- *... 1 more notes in reasoning report*

**src/integrators/context-integrator.js**:
- span.commit_story.context.gather_context is a new span name — the schema defines span.commit_story.context.collect_chat_messages (already in use by a different operation in claude-collector.js), so a distinct name was invented for the orchestrator function in this file.
- formatContextForPrompt and getContextSummary are pure synchronous data transformation functions with no I/O — skipped per RST-001 (No Utility Spans).
- All attributes used are from the registered schema: vcs.ref.head.revision, commit_story.context.messages_count, commit_story.context.sessions_count, commit_story.context.time_window_start, commit_story.context.time_window_end, commit_story.filter.messages_before, commit_story.filter.messages_after. attributesCreated is 0.
- *... 1 more notes in reasoning report*

**src/managers/auto-summarize.js**:
- Three new span names were invented because the schema-defined names (run_summarize, run_weekly_summarize, run_monthly_summarize) were already declared by earlier files in this run. The auto-trigger variants (trigger_auto_summaries, trigger_auto_weekly, trigger_auto_monthly) are semantically distinct — they implement auto-detection and orchestration logic rather than direct invocation.
- The inner catch blocks inside the for loops were NOT given recordException/setStatus because they represent expected control-flow: individual day/week/month failures are collected into result.failed[] and the loop continues. These are graceful-degradation paths, not unexpected errors. The outer try/catch handles genuinely unexpected failures (e.g., findUnsummarizedDays throwing).
- triggerAutoSummaries has an early-return path when daily failures occur. setAttribute calls for generated_count and failed_count were added before both the early return and the normal return to ensure attributes are always set before span.end().
- *... 2 more notes in reasoning report*

**src/managers/journal-manager.js**:
- saveJournalEntry and discoverReflections are the only instrumented functions — all other functions are either unexported pure synchronous helpers (RST-001 (No Utility Spans)/RST-004 (No Internal Detail Spans)) or exported pure synchronous formatters (RST-001 (No Utility Spans): no I/O, no async).
- The inner try/catch blocks inside saveJournalEntry (duplicate detection) and discoverReflections (file read errors, directory not found) are expected-condition catches with empty bodies. These represent normal control flow and were NOT given recordException/setStatus per the error handling rules.
- span.commit_story.journal.save_entry is a new schema extension — no existing schema span matched the file-save-entry operation.
- *... 2 more notes in reasoning report*

**src/managers/summary-manager.js**:
- All 9 async exported functions were instrumented for consistency (COV-004 (Async Operation Spans)). This is above the 20% ratio backstop for total functions (9/13 = 69%), but the file consists entirely of async I/O pipeline functions — the 4 uninstrumented functions are sync pure formatters/computations (RST-001 (No Utility Spans)) that cannot receive spans. Instrumenting all async exports is appropriate given their diagnostic value.
- All inner catch blocks handling file-not-found conditions (access(), readFile(), readdir()) are expected-condition catches representing normal control flow (e.g., DD-003 duplicate detection, missing optional files). These were left without recordException/setStatus to avoid false-positive error signals.
- The commit_story.summary.entries_count attribute was used across all read/generate functions to capture the count of items loaded (daily entries, daily summaries, weekly summaries). This is a semantic fit: the schema defines it as 'entries_count' for the summary domain, covering all variants of input item counts.
- *... 2 more notes in reasoning report*

**src/mcp/server.js**:
- commit_story.cli.main was already in use so the MCP server entry point uses commit_story.mcp.server_start — schema extension reported.
- createServer() is unexported and synchronous (RST-001 (No Utility Spans), RST-004 (No Internal Detail Spans)) — skipped.
- commit_story.mcp.transport and commit_story.mcp.server_name are schema extensions: no registered attribute covers MCP server transport type or server identity; commit_story.context.source describes the data source type (claude_code/git/mcp) not the transport protocol layer, so it is not a semantic match for the stdio transport mechanism.
- *... 1 more notes in reasoning report*

**src/utils/journal-paths.js**:
- Only `ensureDirectory` was instrumented — it is the sole async function with real I/O (mkdir). All other exported functions are pure synchronous path/string computations and are excluded per RST-001 (No Utility Spans).
- Skipped `getSummaryPath` and `getSummariesDirectory` despite their throw statements — throwing on invalid input is synchronous control flow, not async I/O, so RST-001 (No Utility Spans) still applies.
- Span name `commit_story.journal.ensure_directory` is a schema extension; no matching span existed in the registry. The `commit_story.journal.file_path` attribute IS registered and was used to satisfy COV-005 (Domain Attributes) — it captures the file path whose parent directory is being created, directly relevant to diagnosing mkdir failures.
- *... 1 more notes in reasoning report*

**src/utils/summary-detector.js**:
- Schema-defined span names like commit_story.summary.read_day_entries were already declared by earlier files, so unique names were invented for each exported function.
- Unexported helpers (getTodayString, getNowDate, getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries) skipped per RST-004 (No Internal Detail Spans) — all are called by exported orchestrators that have spans.
- Internal try/catch blocks around readdir are control-flow catches (expected ENOENT), not error conditions — recordException/setStatus not added inside them.
- *... 1 more notes in reasoning report*

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-anthropic`
- `@traceloop/instrumentation-mcp`

## Token Usage

| | Ceiling | Actual |
|---|---------|--------|
| **Cost** | $70.20 | $4.25 |
| **Input tokens** | 3,000,000 | 164,030 |
| **Output tokens** | — | 158,726 |
| **Cache read tokens** | — | 113,434 |
| **Cache write tokens** | — | 357,650 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

OK

## Agent Version

`0.1.0`