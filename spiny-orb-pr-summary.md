## Summary

- **Files processed**: 30
- **Committed**: 12
- **Correct skips**: 17
- **Failed**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.13 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 1 | $0.12 | — | `span.commit_story.git.get_commit_data`, `span.commit_story.git.get_previous_commit_time` |
| src/commands/summarize.js | success | 3 | 1 | $0.19 | — | `span.commit_story.summarize.run_daily`, `span.commit_story.summarize.run_weekly`, `span.commit_story.summarize.run_monthly`, `commit_story.summarize.input_count`, `commit_story.summarize.force`, `commit_story.summarize.generated_count`, `commit_story.summarize.failed_count` |
| src/generators/journal-graph.js | success | 2 | 3 | $1.62 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_section`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 1 | $0.25 | `@traceloop/instrumentation-langchain` | `span.commit_story.summary.daily_node`, `span.commit_story.summary.generate_daily`, `span.commit_story.summary.weekly_node`, `span.commit_story.summary.generate_weekly`, `span.commit_story.summary.monthly_node`, `span.commit_story.summary.generate_monthly`, `commit_story.summary.week_label`, `commit_story.summary.month_label` |
| src/index.js | success | 1 | 1 | $0.21 | — | `span.commit_story.cli.main`, `commit_story.cli.subcommand`, `commit_story.commit.is_merge` |
| src/integrators/context-integrator.js | success | 1 | 2 | $0.28 | — | `span.commit_story.context.gather_for_commit` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.15 | — | `span.commit_story.auto_summarize.trigger_all`, `span.commit_story.auto_summarize.trigger_weekly`, `span.commit_story.auto_summarize.trigger_monthly` |
| src/managers/journal-manager.js | success | 2 | 1 | $0.20 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | failed: Schema extension write failed: Command failed: weaver registry resolve -r /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv --format json Resolving registry `/Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv` ℹ Found registry manifest: /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv/registry_manifest.yaml  | 3 | 1 | $0.24 | — | — |
| src/mcp/server.js | success | 1 | 3 | $0.27 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.main`, `commit_story.mcp.transport_type` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.06 | — | `span.commit_story.journal.ensure_directory` |
| src/utils/summary-detector.js | success | 5 | 2 | $0.40 | — | `span.commit_story.summary_detector.get_days_with_entries`, `span.commit_story.summary_detector.find_unsummarized_days`, `span.commit_story.summary_detector.get_days_with_daily_summaries`, `span.commit_story.summary_detector.find_unsummarized_weeks`, `span.commit_story.summary_detector.find_unsummarized_months`, `commit_story.summary_detector.result_count` |

**Correct skips** (17 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 |
| src/collectors/git-collector.js | 0 | 0 | 2 | 6 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 |
| src/generators/prompts/guidelines/accessibility.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/guidelines/anti-hallucination.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/sections/dialogue-prompt.js | 0 | 0 | 0 | 0 |
| src/generators/prompts/sections/technical-decisions-prompt.js | 0 | 0 | 0 | 0 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 |
| src/index.js | 0 | 0 | 1 | 9 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
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
- commit_story.cli.subcommand
- commit_story.commit.is_merge
- commit_story.mcp.transport_type
- commit_story.summarize.failed_count
- commit_story.summarize.force
- commit_story.summarize.generated_count
- commit_story.summarize.input_count
- commit_story.summary.month_label
- commit_story.summary.week_label
- commit_story.summary_detector.result_count




## Review Attention

- **src/generators/summary-graph.js**: 6 spans added (average: 2) — outlier, review recommended
- **src/utils/summary-detector.js**: 5 spans added (average: 2) — outlier, review recommended

### Advisory Findings

- **COV-004 (Async Operation Spans)** (src/generators/journal-graph.js): "technicalNode" (async function) at line 481 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/generators/journal-graph.js): "dialogueNode" (async function) at line 525 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **CDQ-006 (isRecording Guard)** (src/generators/journal-graph.js): setAttribute value "sections.generatedAt.toISOString().split..." at line 623 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- **NDS-005 (Control Flow Preserved)** (src/index.js): NDS-005: Original try/catch block (line 490) is missing from instrumented output. Instrumentation must preserve existing error handling structure — do not remove or merge try/catch/finally blocks. Judge assessment (confidence 95%): semantics not preserved. Restore the original try/catch block structure from line 490. Do not merge, remove, or restructure catch clauses. Verify that exception types are caught in the same order, re-throw statements are preserved exactly as written, and the finally block (if present) executes in the original sequence. If instrumentation requires wrapping, do so outside the original try/catch/finally boundaries.
- **CDQ-006 (isRecording Guard)** (src/managers/journal-manager.js): setAttribute value "(commit.message || '').split('\n')[0]" at line 187 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/context-capture-tool.js): "saveContext" (async function) at line 69 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/context-capture-tool.js): "registerContextCaptureTool" (contains await) at line 87 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/reflection-tool.js): "saveReflection" (async function) at line 65 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/reflection-tool.js): "registerReflectionTool" (contains await) at line 83 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **CDQ-008 (Tracer Naming)** ((run-level)): All tracer names follow a consistent naming pattern.

## Agent Notes

**src/collectors/claude-collector.js**:
- span.commit_story.context.collect_chat_messages is a new span name not in the schema registry. It represents the top-level orchestration of Claude chat history collection — no existing schema span covers this operation.
- getClaudeProjectPath, findJSONLFiles, and parseJSONLFile are synchronous helpers called from collectChatMessages. Per RST-004 (No Internal Detail Spans), they are covered by the orchestrator span and not instrumented separately.
- encodeProjectPath, filterMessages, and groupBySession are pure synchronous data transformations with no I/O. Skipped per RST-001 (No Utility Spans).
- *... 2 more notes in reasoning report*

**src/collectors/git-collector.js**:
- runGit, getCommitMetadata, getCommitDiff, and getMergeInfo are all unexported internal helpers — skipped per RST-004 (No Internal Detail Spans). Their git I/O executions become child activity under the exported orchestrator spans through context propagation.
- getCommitData captures the merged result object into a const before returning, enabling setAttribute calls on result.author, result.subject, and result.timestamp without modifying non-instrumentation logic.
- result.timestamp is a Date object; converted via .toISOString() before setAttribute to satisfy attribute type safety (CDQ-007 — no raw objects).
- *... 2 more notes in reasoning report*

**src/commands/summarize.js**:
- Skipped isValidDate (unexported, pure synchronous validation — RST-001 (No Utility Spans)/RST-004 (No Internal Detail Spans)), isValidWeekString, isValidMonthString, expandDateRange, parseSummarizeArgs (exported but pure synchronous data transformations with no I/O — RST-001 (No Utility Spans)), and showSummarizeHelp (synchronous, trivial console output — RST-001 (No Utility Spans)).
- The inner catch blocks inside the for loops in runSummarize, runWeeklySummarize, and runMonthlySummarize were intentionally NOT given span.recordException/setStatus. These catches handle expected per-item failures gracefully (pushing to result.failed array and continuing), so marking the outer span as ERROR would be incorrect — the orchestrating function itself succeeds even when individual items fail.
- No registered schema attributes matched the summarize command concepts (input item count, force flag, result counts), so four new attributes were introduced under the commit_story.summarize namespace: commit_story.summarize.input_count captures the number of dates/weeks/months to process; commit_story.summarize.force captures the force override flag; commit_story.summarize.generated_count and commit_story.summarize.failed_count capture outcome totals after the loop completes.
- *... 1 more notes in reasoning report*

**src/generators/journal-graph.js**:
- NDS-003 (Code Preserved) fix: restored the exact original line in formatChatMessages — the template literal return statement now matches the original source exactly, including the trailing space before the semicolon that was present in the original file.
- The three LangGraph node functions (summaryNode, technicalNode, dialogueNode) are categorized as external calls because they orchestrate AI model invocations via LangChain. The actual model.invoke() calls are covered by LangChainInstrumentation, but the nodes receive manual spans to capture orchestration-level context and AI request/response attributes.
- Node functions have catch blocks that return error state rather than rethrowing. recordException + setStatus(ERROR) are still added because these represent genuine AI generation failures, not expected control-flow conditions.
- *... 14 more notes in reasoning report*

**src/generators/summary-graph.js**:
- The inner catch blocks inside dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are expected-condition catches (they return degraded state rather than throwing), so recordException/setStatus were NOT added to those catches. The outer try/catch/finally in the span wrapper handles any unexpected errors that escape.
- LangChain is imported via @langchain/langgraph and @langchain/anthropic — @traceloop/instrumentation-langchain will auto-instrument the model.invoke() calls as child spans. Manual spans are still added to the node and generate functions to capture application-level orchestration context.
- commit_story.summary.week_label and commit_story.summary.month_label are new schema extensions. No existing registered key semantically matches a week identifier (e.g. '2026-W09') or month identifier (e.g. '2026-02'). commit_story.journal.entry_date is specifically for YYYY-MM-DD day-level dates and would be semantically incorrect for week/month period labels.
- *... 2 more notes in reasoning report*

**src/index.js**:
- span.commit_story.cli.main is a new span not in the schema — main() is the CLI entry point and COV-001 (Entry Point Spans) requires it have a span. No existing schema span matches this root entry point role.
- commit_story.cli.subcommand is a new attribute capturing which subcommand was dispatched (e.g., 'summarize'). No existing schema attribute covers the concept of a CLI subcommand selector — the closest would be a filter or operation type, but neither is semantically equivalent.
- commit_story.commit.is_merge is a new boolean attribute on the main span. No registered key captures whether the processed commit is a merge commit. This is useful for filtering spans by commit type in dashboards.
- *... 2 more notes in reasoning report*

**src/integrators/context-integrator.js**:
- span.commit_story.context.gather_for_commit is a new span name — no existing schema span matches this orchestration function. The existing schema span commit_story.context.collect_chat_messages (already used in claude-collector.js) covers the lower-level chat collection, not this higher-level coordination of git + chat + filtering.
- formatContextForPrompt and getContextSummary are skipped per RST-001 (No Utility Spans) — both are pure synchronous data transformations with no I/O, no async work, and no network/disk access.
- Time window attributes are set using context.metadata.timeWindow.start/end after the context object is constructed, avoiding any new variable declarations that would violate NDS-003 (Code Preserved).
- *... 1 more notes in reasoning report*

**src/managers/auto-summarize.js**:
- New span names were invented for all three exported functions because the schema-defined names `commit_story.summarize.run_daily`, `commit_story.summarize.run_weekly`, and `commit_story.summarize.run_monthly` were already declared by earlier files in this instrumentation run and cannot be reused for these different auto-trigger orchestrator functions.
- The inner per-item catch blocks inside the for-loops were intentionally NOT given `recordException`/`setStatus` because they represent expected control-flow failures — individual item failures are accumulated into `result.failed` and the loop continues. These catches have no rethrow and represent graceful degradation, not unexpected errors.
- The `triggerAutoSummaries` function has two return paths (early return on daily failures, and combined final return). Both paths set `generated_count` and `failed_count` attributes before returning, ensuring the span always carries outcome attributes regardless of which exit path is taken.
- *... 2 more notes in reasoning report*

**src/managers/journal-manager.js**:
- saveJournalEntry and discoverReflections are the only two functions instrumented. All other functions are either unexported (RST-004 (No Internal Detail Spans)) or pure synchronous transformations with no I/O (RST-001 (No Utility Spans)).
- The inner try/catch in saveJournalEntry (checking for duplicate entries) has an empty catch block representing expected control flow (file-not-found). No recordException/setStatus was added there per the expected-condition catches rule.
- Both inner try/catch blocks in discoverReflections (readdir and readFile failures) are empty expected-condition catches representing graceful skip behavior. No error recording was added to these.
- *... 2 more notes in reasoning report*

**src/managers/summary-manager.js**:
- Three new span names were invented because the schema-defined names (commit_story.summary.generate_daily, commit_story.summary.generate_weekly, commit_story.summary.generate_monthly) were already claimed by earlier files in this run. The pipeline suffix distinguishes these end-to-end orchestration spans from any generator-level spans.
- formatDailySummary, formatWeeklySummary, formatMonthlySummary were skipped — pure synchronous string formatters with no I/O (RST-001 (No Utility Spans)).
- getWeekBoundaries and getMonthBoundaries were skipped — synchronous pure computations with no I/O (RST-001 (No Utility Spans)).
- *... 2 more notes in reasoning report*

**src/mcp/server.js**:
- span.commit_story.mcp.main is a schema extension — no existing registry span covers MCP server startup/initialization. The closest existing spans are CLI entry points (commit_story.cli.main), but this is a distinct transport protocol (stdio/MCP) entry point.
- createServer() is skipped per RST-003 (thin wrapper/unexported internal) and RST-004 (unexported function). Its logic runs inside main()'s span.
- server.name and server.transport are invented attributes (not in registry) to satisfy COV-005 (Domain Attributes) — the schema has no MCP server metadata keys. These provide basic service identity context for the root span.
- *... 4 more notes in reasoning report*

**src/utils/journal-paths.js**:
- Only `ensureDirectory` was instrumented. All other 11 functions are pure synchronous helpers (path computation, string formatting, date parsing) with no I/O — RST-001 (No Utility Spans) applies to all of them.
- The new span name `commit_story.journal.ensure_directory` is not in the schema. No existing schema span matches this filesystem directory-creation operation.
- The `commit_story.journal.file_path` registered attribute was used to record the input `filePath` parameter, satisfying COV-005 (Domain Attributes) with a schema-registered key rather than an invented one.

**src/utils/summary-detector.js**:
- Unexported async helpers (getSummarizedDays, getSummarizedWeeks, getSummarizedMonths, getWeeksWithWeeklySummaries) were skipped per RST-004 (No Internal Detail Spans) — they are called only from exported orchestrators that already have spans.
- Inner try/catch blocks (readdir error handling) are expected-condition catches for missing directories returning graceful empty results — no recordException/setStatus added per the Error Handling rules.
- Early-return guards (if length === 0 return []) are preserved verbatim. The result_count attribute is only set on the normal completion path where results are actually computed; this avoids modifying those guard lines while still providing diagnostic value on the paths that do work.
- *... 1 more notes in reasoning report*

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-mcp`

## Token Usage

| | Ceiling | Actual |
|---|---------|--------|
| **Cost** | $70.20 | $4.36 |
| **Input tokens** | 3,000,000 | 131,175 |
| **Output tokens** | — | 175,800 |
| **Cache read tokens** | — | 422,174 |
| **Cache write tokens** | — | 320,870 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

OK

## Agent Version

`0.1.0`

## Warnings

- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/summary-manager.js — Schema extension write failed: Command failed: weaver registry resolve -r /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv --format json
Resolving registry `/Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv`
ℹ Found registry manifest: /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv/registry_manifest.yaml

- Schema extension write failed: Command failed: weaver registry resolve -r /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv --format json
Resolving registry `/Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv`
ℹ Found registry manifest: /Users/whitney.lee/Documents/Repositories/commit-story-v2/semconv/registry_manifest.yaml

- Live-check partial: 1 file(s) failed instrumentation (/Users/whitney.lee/Documents/Repositories/commit-story-v2/src/managers/summary-manager.js). Compliance report may be incomplete — spans from failed files are missing.