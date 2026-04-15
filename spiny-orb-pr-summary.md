## Summary

- **Files processed**: 30
- **Committed**: 12
- **No changes needed**: 18

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.14 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 1 | $0.13 | — | `span.commit_story.git.get_commit_data`, `span.commit_story.git.get_previous_commit_time` |
| src/commands/summarize.js | success | 3 | 1 | $0.21 | — | `span.commit_story.summarize.run_daily`, `span.commit_story.summarize.run_weekly`, `span.commit_story.summarize.run_monthly`, `commit_story.summarize.input_count`, `commit_story.summarize.force`, `commit_story.summarize.generated_count`, `commit_story.summarize.failed_count` |
| src/generators/journal-graph.js | success | 4 | 3 | $1.52 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_summary`, `span.commit_story.journal.technical_node`, `span.commit_story.journal.dialogue_node`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 1 | $0.31 | `@traceloop/instrumentation-langchain` | `span.commit_story.summary.daily_summary_node`, `span.commit_story.summary.generate_daily_summary`, `span.commit_story.summary.weekly_summary_node`, `span.commit_story.summary.generate_weekly_summary`, `span.commit_story.summary.monthly_summary_node`, `span.commit_story.summary.generate_monthly_summary` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.11 | — | `span.commit_story.context.gather_context` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.17 | — | `span.commit_story.summarize.trigger_auto_summaries`, `span.commit_story.summarize.trigger_auto_weekly`, `span.commit_story.summarize.trigger_auto_monthly` |
| src/managers/journal-manager.js | success | 2 | 2 | $0.43 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | success | 3 | 3 | $1.13 | — | `span.commit_story.summary.generate_and_save_daily`, `span.commit_story.summary.generate_and_save_weekly`, `span.commit_story.summary.generate_and_save_monthly`, `commit_story.summary.week_label`, `commit_story.summary.month_label` |
| src/mcp/server.js | success | 1 | 1 | $0.13 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.start_server`, `commit_story.mcp.server.name`, `commit_story.mcp.server.version` |
| src/utils/journal-paths.js | success | 1 | 3 | $0.34 | — | `span.commit_story.journal.ensure_directory` |
| src/utils/summary-detector.js | success | 5 | 2 | $0.41 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `span.commit_story.summary.find_unsummarized_months`, `commit_story.summary.entry_days_count`, `commit_story.summary.unsummarized_days_count`, `commit_story.summary.daily_summary_days_count`, `commit_story.summary.unsummarized_weeks_count`, `commit_story.summary.unsummarized_months_count` |

**No changes needed** (18 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/index.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

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
| src/index.js | 0 | 0 | 0 | 9 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/managers/summary-manager.js | 0 | 0 | 3 | 14 |
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
- commit_story.mcp.server.name
- commit_story.mcp.server.version
- commit_story.summarize.failed_count
- commit_story.summarize.force
- commit_story.summarize.generated_count
- commit_story.summarize.input_count
- commit_story.summary.daily_summary_days_count
- commit_story.summary.entry_days_count
- commit_story.summary.month_label
- commit_story.summary.unsummarized_days_count
- commit_story.summary.unsummarized_months_count
- commit_story.summary.unsummarized_weeks_count
- commit_story.summary.week_label




### New Span IDs (32)

- `span.commit_story.ai.generate_summary`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.journal.dialogue_node`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.technical_node`
- `span.commit_story.mcp.start_server`
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_monthly`
- `span.commit_story.summarize.run_weekly`
- `span.commit_story.summarize.trigger_auto_monthly`
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly`
- `span.commit_story.summary.daily_summary_node`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.generate_and_save_monthly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.generate_daily_summary`
- `span.commit_story.summary.generate_monthly_summary`
- `span.commit_story.summary.generate_weekly_summary`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.monthly_summary_node`
- `span.commit_story.summary.weekly_summary_node`

## Review Attention

- **src/generators/summary-graph.js**: 6 spans added (average: 2) — outlier, review recommended
- **src/utils/summary-detector.js**: 5 spans added (average: 2) — outlier, review recommended

### Advisory Findings

**src/commands/summarize.js**
- SCH-004 (No Redundant Schema Entries): Attribute key "commit_story.summarize.generated_count" at line 260 appears to be a semantic duplicate of an existing registry entry (judge confidence: 72%). Use registered attribute 'commit_story.context.messages_count' instead, as both measure generated/counted discrete items within the commit_story domain. If 'generated_count' specifically measures AI-generated summaries rather than context messages, consider renaming to 'commit_story.summarize.summaries_count' for semantic clarity, or map it to an existing OpenTelemetry semantic convention if it represents a standard metric like token usage.

**src/index.js**
- COV-004 (Async Operation Spans): "handleSummarize" (async function) at line 208 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.

**src/managers/journal-manager.js**
- CDQ-006 (isRecording Guard): setAttribute value "entryPath.split('/').pop()" at line 187 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.

**src/mcp/tools/context-capture-tool.js**
- COV-004 (Async Operation Spans): "saveContext" (async function) at line 69 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): "saveReflection" (async function) at line 65 has no span. Async functions and await expressions benefit from spans for latency tracking and error visibility. Consider adding a span.

**(run-level)**
- CDQ-008 (Tracer Naming): All tracer names follow a consistent naming pattern.

## Agent Notes

Each instrumented file has a companion `.instrumentation.md` file in the same directory (e.g., `src/api.js` → `src/api.instrumentation.md`) containing the agent's full decision notes.

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-mcp`

> **Important**: Initialize these packages **inside your application code**, not via `--import`. Loading them through `--import` can install a competing ESM hook registry alongside the one already registered by your OTel SDK, causing spans to be created but silently dropped — the exporter reports success but data never reaches the backend.

## Token Usage

| | Ceiling | Actual |
|---|---------|--------|
| **Cost** | $70.20 | $5.59 |
| **Input tokens** | 3,000,000 | 195,275 |
| **Output tokens** | — | 226,912 |
| **Cache read tokens** | — | 416,944 |
| **Cache write tokens** | — | 393,535 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

OK

## Agent Version

`1.0.0`