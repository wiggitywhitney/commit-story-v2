## Summary

- **Files processed**: 30
- **Committed**: 12
- **Correct skips**: 17
- **Partial**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.14 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 1 | $0.12 | — | `span.commit_story.git.get_previous_commit_time`, `span.commit_story.git.get_commit_data` |
| src/commands/summarize.js | success | 3 | 1 | $0.20 | — | `span.commit_story.summarize.run_daily`, `span.commit_story.summarize.run_weekly`, `span.commit_story.summarize.run_monthly`, `commit_story.summarize.dates_count`, `commit_story.summarize.weeks_count`, `commit_story.summarize.months_count`, `commit_story.summarize.force`, `commit_story.summarize.generated_count` |
| src/generators/journal-graph.js | success | 4 | 3 | $1.51 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_summary`, `span.commit_story.ai.generate_technical_decisions`, `span.commit_story.journal.generate_dialogue`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $0.59 | `@traceloop/instrumentation-langchain` | `span.commit_story.summarize.generate_daily`, `span.commit_story.summarize.generate_weekly`, `span.commit_story.summarize.generate_monthly`, `span.commit_story.summarize.daily_node`, `span.commit_story.summarize.weekly_node`, `span.commit_story.summarize.monthly_node`, `commit_story.summarize.week_label`, `commit_story.summarize.month_label` |
| src/index.js | success | 1 | 2 | $0.67 | — | `span.commit_story.cli.main` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.14 | — | `span.commit_story.context.gather_context` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.15 | — | `span.commit_story.summarize.trigger_auto_summaries`, `span.commit_story.summarize.trigger_auto_weekly`, `span.commit_story.summarize.trigger_auto_monthly` |
| src/managers/journal-manager.js | success | 2 | 2 | $0.39 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | success | 3 | 2 | $0.55 | — | `span.commit_story.summarize.generate_and_save_daily`, `span.commit_story.summarize.generate_and_save_weekly`, `span.commit_story.summarize.generate_and_save_monthly` |
| src/mcp/server.js | success | 1 | 2 | $0.22 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.main`, `commit_story.mcp.server_name`, `commit_story.mcp.server_version` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.06 | — | `span.commit_story.journal.ensure_directory` |
| src/utils/summary-detector.js | partial (3/5 functions) | 3 | 1 | $0.45 | — | `span.commit_story.summarize.get_days_with_daily_summaries`, `span.commit_story.summarize.find_unsummarized_weeks`, `span.commit_story.summarize.find_unsummarized_months` |

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
| src/managers/summary-manager.js | 0 | 0 | 3 | 14 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/traceloop-init.js | 0 | 0 | 0 | 0 |
| src/utils/config.js | 0 | 0 | 0 | 0 |
| src/utils/journal-paths.js | 1 | 0 | 0 | 12 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.mcp.server_name
- commit_story.mcp.server_version
- commit_story.summarize.dates_count
- commit_story.summarize.force
- commit_story.summarize.generated_count
- commit_story.summarize.month_label
- commit_story.summarize.months_count
- commit_story.summarize.week_label
- commit_story.summarize.weeks_count




### Span Extensions (31)

- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `span.commit_story.cli.main`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.save_entry`
- `span.commit_story.mcp.main`
- `span.commit_story.summarize.daily_node`
- `span.commit_story.summarize.find_unsummarized_months`
- `span.commit_story.summarize.find_unsummarized_weeks`
- `span.commit_story.summarize.generate_and_save_daily`
- `span.commit_story.summarize.generate_and_save_monthly`
- `span.commit_story.summarize.generate_and_save_weekly`
- `span.commit_story.summarize.generate_daily`
- `span.commit_story.summarize.generate_monthly`
- `span.commit_story.summarize.generate_weekly`
- `span.commit_story.summarize.get_days_with_daily_summaries`
- `span.commit_story.summarize.monthly_node`
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_monthly`
- `span.commit_story.summarize.run_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summarize.weekly_node`

## Review Attention

- **src/commands/summarize.js**: 3 spans added (average: 1) — outlier, review recommended
- **src/generators/summary-graph.js**: 6 spans added (average: 1) — outlier, review recommended
- **src/managers/auto-summarize.js**: 3 spans added (average: 1) — outlier, review recommended
- **src/managers/summary-manager.js**: 3 spans added (average: 1) — outlier, review recommended

### Advisory Findings

- **SCH-004 (No Redundant Schema Entries)** (src/commands/summarize.js): Attribute key "commit_story.summarize.dates_count" at line 193 appears to be a semantic duplicate of an existing registry entry (judge confidence: 85%). This appears to be a semantic duplicate of an existing registered key. The attribute 'commit_story.summarize.dates_count' measures a count within the summarization domain of commit_story. However, examining the registry, there is no direct semantic match. The key is semantically distinct because it captures a unique concept: the count of dates identified/extracted during the summarization process. Unlike 'commit_story.journal.quotes_count' (quotes in journal entries) or 'commit_story.journal.word_count' (word count in journal), this key measures dates specifically within summarization output. Since it represents a novel summarization-specific metric not covered by existing keys, it should be registered as a new semantic convention attribute following the pattern: 'commit_story.summarize.dates_count'. If you must map to existing keys, there is no semantically equivalent registered attribute; do not force a mapping.
- **SCH-004 (No Redundant Schema Entries)** (src/generators/summary-graph.js): Attribute key "commit_story.summarize.week_label" at line 472 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Replace 'commit_story.summarize.week_label' with 'commit_story.summarize.weeks_count'. The novel key appears to be a label/identifier for weeks in the summarization context, but the registry already captures the week dimension via 'commit_story.summarize.weeks_count'. If you need to preserve a week label/identifier distinct from the count, consider renaming to 'commit_story.summarize.week_identifier' or 'commit_story.summarize.selected_week' to avoid semantic overlap with the existing weeks_count attribute.
- **SCH-004 (No Redundant Schema Entries)** (src/generators/summary-graph.js): Attribute key "commit_story.summarize.month_label" at line 692 appears to be a semantic duplicate of an existing registry entry (judge confidence: 78%). Replace 'commit_story.summarize.month_label' with 'commit_story.summarize.months_count'. The novel key appears to be labeling or categorizing months, which is a derived representation of month counting. The registered key 'commit_story.summarize.months_count' captures the same semantic concept (month-related aggregation in summarization) within the same domain. Using the count-based key maintains consistency with the parallel structure of 'commit_story.summarize.dates_count' and 'commit_story.summarize.weeks_count'.
- **NDS-005 (Control Flow Preserved)** (src/index.js): NDS-005: Original try/catch block (line 490) is missing from instrumented output. Instrumentation must preserve existing error handling structure — do not remove or merge try/catch/finally blocks. Judge assessment (confidence 95%): semantics not preserved. Restore the original try/catch block structure from line 490. Do not merge, remove, or restructure exception handling blocks. Preserve the exact catch clause ordering and re-throw behavior. If instrumentation code must be added, integrate it within the existing try/catch/finally structure without altering the control flow or exception propagation semantics.
- **CDQ-006 (isRecording Guard)** (src/managers/journal-manager.js): setAttribute value "commit.timestamp.toISOString().split('T'..." at line 187 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "readDayEntries" (async function) at line 29 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "saveDailySummary" (async function) at line 88 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "readWeekDailySummaries" (async function) at line 215 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "saveWeeklySummary" (async function) at line 277 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "readMonthWeeklySummaries" (async function) at line 398 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/managers/summary-manager.js): "saveMonthlySummary" (async function) at line 478 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **SCH-004 (No Redundant Schema Entries)** (src/mcp/server.js): Attribute key "commit_story.mcp.server_name" at line 54 appears to be a semantic duplicate of an existing registry entry (judge confidence: 85%). The attribute 'commit_story.mcp.server_name' is a semantic duplicate of 'gen_ai.provider.name'. Both capture the identity of the AI/MCP service provider being used. Migrate to 'gen_ai.provider.name' to align with OpenTelemetry semantic conventions.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/context-capture-tool.js): "saveContext" (async function) at line 69 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/mcp/tools/reflection-tool.js): "saveReflection" (async function) at line 65 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/utils/summary-detector.js): "getSummarizedDays" (async function) at line 100 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/utils/summary-detector.js): "getSummarizedWeeks" (async function) at line 150 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/utils/summary-detector.js): "getSummarizedMonths" (async function) at line 263 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **COV-004 (Async Operation Spans)** (src/utils/summary-detector.js): "getWeeksWithWeeklySummaries" (async function) at line 288 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.
- **CDQ-008 (Tracer Naming)** ((run-level)): All tracer names follow a consistent naming pattern.

## Agent Notes

**src/collectors/claude-collector.js**:
- span.commit_story.context.collect_chat_messages is a new span name not in the registry. It represents the top-level orchestration of Claude Code chat collection, combining filesystem discovery, JSONL parsing, filtering, and session grouping into a single traced operation.
- Only collectChatMessages was instrumented. Synchronous helpers findJSONLFiles and parseJSONLFile perform disk I/O but are called from the orchestrator span — per RST-004 (No Internal Detail Spans), their I/O is covered under the parent span's context without needing their own child spans.
- getClaudeProjectsDir, encodeProjectPath, filterMessages, and groupBySession are pure synchronous data transformations with no I/O or async operations; skipped per RST-001 (No Utility Spans).
- *... 2 more notes in reasoning report*

**src/collectors/git-collector.js**:
- Skipped runGit, getCommitMetadata, getCommitDiff, and getMergeInfo per RST-004 (No Internal Detail Spans) — all are unexported. Their I/O (execFileAsync child process calls) becomes child activity within the exported orchestrator spans via context propagation.
- For commit_story.commit.message in getCommitData, result.subject (the first line) was used rather than result.message (the full body-inclusive string) because the schema attribute is defined as 'The first line of the commit message'.
- The timestamp Date object is converted to ISO 8601 string via .toISOString() before setAttribute to satisfy CDQ-007 type safety — OTel attributes must be primitives, not Date objects.
- *... 1 more notes in reasoning report*

**src/commands/summarize.js**:
- No schema span matched runSummarize, runWeeklySummarize, or runMonthlySummarize — invented names under commit_story.summarize.* namespace following the project prefix convention.
- The inner catch blocks inside the per-date/week/month loops (which push to result.failed and do NOT re-throw) are expected-condition catches representing graceful per-item failure handling. recordException/setStatus were NOT added there to avoid false error signals on the outer span — only a truly unhandled top-level failure triggers span ERROR status.
- The empty catch block for access(summaryPath) is an ENOENT-style expected-condition catch (file not found means proceed with generation) — no recordException/setStatus added per the expected-condition catch rule.
- *... 2 more notes in reasoning report*

**src/generators/journal-graph.js**:
- The catch blocks in summaryNode, technicalNode, and dialogueNode are graceful fallback paths (they return error-state objects instead of rethrowing), so recordException/setStatus were NOT added per the expected-condition catch rule. These catches represent deliberate resilience, not unhandled failures.
- The node functions (summaryNode, technicalNode, dialogueNode) are all exported via the bottom export block and make LLM API calls, so COV-004 (Async Operation Spans) requires instrumenting all three consistently. Each receives commit_story.ai.section_type to distinguish them in traces.
- generateJournalSections uses return-value capture (const sections = {...}) to allow setting commit_story.journal.sections and commit_story.journal.word_count from the assembled result object. This is the only permitted non-instrumentation code change.
- *... 15 more notes in reasoning report*

**src/generators/summary-graph.js**:
- The inner catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are expected-condition catches (graceful degradation — they return a fallback result rather than rethrowing). Per the error-handling rules, recordException and setStatus are NOT added to these catches. The outer try/finally ensures span.end() is always called regardless.
- commit_story.summarize.week_label is a new schema extension because no existing registered attribute captures an ISO week identifier string (e.g., '2026-W09'). commit_story.summarize.weeks_count is a numeric count, not a label string — semantically distinct.
- commit_story.summarize.month_label is a new schema extension because no existing registered attribute captures a month identifier string (e.g., '2026-02'). commit_story.summarize.months_count is a numeric count; the SCH-004 (No Redundant Schema Entries) advisory notes 72% confidence overlap but the two attributes are intentionally different types (string label vs integer count).
- *... 2 more notes in reasoning report*

**src/index.js**:
- Removed the if (context.chat) guard around commit_story.context.messages_count setAttribute — the validator flagged it as a non-instrumentation line (NDS-003 (Code Preserved)). That attribute is omitted from this span rather than risk a business-logic violation.
- span.commit_story.cli.main is a new span name not in the registry — no existing schema span matches the top-level CLI entry point. Reported as a schemaExtension.
- handleSummarize is unexported (RST-004 (No Internal Detail Spans) applies) and always terminates via process.exit(). span.end() is called before delegating to it so the main span is properly closed even though handleSummarize never returns.
- *... 1 more notes in reasoning report*

**src/integrators/context-integrator.js**:
- span.commit_story.context.gather_context is a new schema extension — no existing span in the registry covers the orchestration of git data collection, chat collection, filtering, and token budgeting into a single context object. The existing span commit_story.context.collect_chat_messages covers only the chat collection sub-step.
- formatContextForPrompt and getContextSummary are both pure synchronous data transformations with no I/O — RST-001 (No Utility Spans) applies, so they were skipped despite being exported.
- filterStats.total is mapped to commit_story.filter.messages_before (messages before noise-removal filtering) and filterStats.preserved to commit_story.filter.messages_after — these are the closest semantic matches in the registry for before/after filter counts.
- *... 1 more notes in reasoning report*

**src/managers/auto-summarize.js**:
- Schema-defined span names run_daily, run_weekly, run_monthly were already declared by earlier files in this run, so new unique names were invented: trigger_auto_summaries, trigger_auto_weekly, trigger_auto_monthly. These represent the auto-trigger orchestration layer rather than the core generation operations.
- Inner catch blocks inside the loops (per-day/week/month failures) were intentionally NOT given recordException/setStatus because they represent graceful partial-failure handling — each failed item is pushed to result.failed and execution continues. These are expected control-flow catches, not unexpected errors.
- commit_story.summarize.dates_count was used for the unsummarizedDays count in triggerAutoSummaries (matching the schema's int attribute for dates), weeks_count for weeks, months_count for months. generated_count was set at all return paths (including the early-return path when dailies had failures) to capture how many summaries were successfully written.
- *... 2 more notes in reasoning report*

**src/managers/journal-manager.js**:
- Removed if-guards around commit.hash and commit.author setAttribute calls to fix NDS-003 (Code Preserved) — conditional guards around setAttribute calls are considered non-instrumentation code additions by the validator. The attributes are set unconditionally, which may produce undefined values if those fields are absent on the commit object.
- formatJournalEntry and formatTimestamp are exported but pure synchronous data transformations — skipped per RST-001 (No Utility Spans).
- Inner empty catch blocks in saveJournalEntry and discoverReflections are expected-condition catches (file not found, unreadable file, missing directory) — no recordException or setStatus added per the expected-condition exception.
- *... 1 more notes in reasoning report*

**src/managers/summary-manager.js**:
- All schema-defined span names for summarize pipelines were already claimed by earlier files. New names generate_and_save_* were invented to avoid collision.
- The previous submission incorrectly renamed `path` to `savedPath` to enable setAttribute — but the rules allow capturing return values to a const only when the original code did not already use a variable. Since the original code already used `const path = await save*()`, the original variable name must be preserved. setAttribute('commit_story.journal.file_path', path) is added after the existing `if (!path)` guard using the original variable name.
- Only the 3 pipeline orchestrators were instrumented (3/14 = 21%) to stay near the ratio threshold. The 6 async helper functions (readDayEntries, saveDailySummary, readWeekDailySummaries, saveWeeklySummary, readMonthWeeklySummaries, saveMonthlySummary) are all called from within the pipeline spans and their I/O is covered through context propagation.
- *... 1 more notes in reasoning report*

**src/mcp/server.js**:
- service.name and service.version are standard OTel resource semantic conventions but are not in this project's registry; replaced with project-namespaced keys commit_story.mcp.server_name and commit_story.mcp.server_version to satisfy SCH-002 (Attribute Keys Match Registry). No existing registered key captures MCP server identity metadata.
- commit_story.mcp.server_name captures the MCP server's configured name ('commit-story') to identify which server instance is running; no registered key is a semantic match.
- commit_story.mcp.server_version captures the MCP server's version string ('2.0.0') for deployment identification; no registered key is a semantic match.
- *... 2 more notes in reasoning report*

**src/utils/journal-paths.js**:
- Only `ensureDirectory` was instrumented. All other 11 functions are pure synchronous data transformations (path and date string computations) with no I/O, network access, or async operations — RST-001 (No Utility Spans) applies.
- The new span `commit_story.journal.ensure_directory` has no counterpart in the schema registry. It was added as a schema extension because it covers a filesystem I/O operation (mkdir) that has real diagnostic value for debugging directory creation failures.
- The existing schema attribute `commit_story.journal.file_path` was used on the `ensure_directory` span to capture the file path argument, satisfying COV-005 (Domain Attributes) without creating a new attribute key.

**src/utils/summary-detector.js**:
- Function-level fallback: 3/5 functions instrumented
-   instrumented: getDaysWithDailySummaries (1 spans)
-   instrumented: findUnsummarizedWeeks (1 spans)
- *... 3 more notes in reasoning report*

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-mcp`

## Token Usage

| | Ceiling | Actual |
|---|---------|--------|
| **Cost** | $70.20 | $5.45 |
| **Input tokens** | 3,000,000 | 227,227 |
| **Output tokens** | — | 208,129 |
| **Cache read tokens** | — | 498,652 |
| **Cache write tokens** | — | 398,510 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

OK

## Agent Version

`1.0.0`