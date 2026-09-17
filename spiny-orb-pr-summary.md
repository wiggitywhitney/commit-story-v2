## Summary

- **Files processed**: 32
- **Committed**: 12
- **No changes needed**: 19
- **Partial**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.21 | — | 1 (see Schema Changes) |
| src/collectors/git-collector.js | success | 6 | 1 | $0.25 | — | 11 (see Schema Changes) |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.31 | — | 1 (see Schema Changes) |
| src/generators/journal-graph.js | success | 4 | 2 | $0.78 | `@traceloop/instrumentation-langchain` | 4 (see Schema Changes) |
| src/generators/summary-graph.js | success | 6 | 1 | $0.73 | `@traceloop/instrumentation-langchain` | 11 (see Schema Changes) |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp`, `@opentelemetry/instrumentation-pino` | 2 (see Schema Changes) |
| src/utils/journal-paths.js | success | 1 | 1 | $0.17 | — | 1 (see Schema Changes) |
| src/managers/journal-manager.js | success | 2 | 1 | $0.44 | — | 2 (see Schema Changes) |
| src/managers/summary-manager.js | success | 9 | 2 | $1.89 | — | 10 (see Schema Changes) |
| src/commands/summarize.js | partial (7/7 functions) | 3 | 3 | $1.16 | — | 7 (see Schema Changes) |
| src/utils/summary-detector.js | success | 9 | 1 | $0.38 | — | 13 (see Schema Changes) |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.27 | — | 7 (see Schema Changes) |
| src/index.js | success | 2 | 1 | $0.39 | — | 3 (see Schema Changes) |

**No changes needed** (19 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

*Self-reported by the LLM, not independently verified against the diff. "External Calls" counts manually-wrapped spans only — calls covered by an auto-instrumentation library are not included.*

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions | Attrs Reused / New |
|------|---------------|----------------|---------------------|-----------------|---------------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 | 0 / 0 |
| src/collectors/git-collector.js | 1 | 0 | 2 | 6 | 0 / 5 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 | 0 / 0 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 | 0 / 0 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 | 0 / 5 |
| src/mcp/server.js | 0 | 0 | 1 | 2 | 0 / 1 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 | 0 / 0 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 | 0 / 0 |
| src/managers/summary-manager.js | not reported | not reported | not reported | not reported | 0 / 1 |
| src/commands/summarize.js | not reported | not reported | not reported | not reported | 0 / 4 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 | 0 / 4 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 | 0 / 4 |
| src/index.js | 0 | 0 | 2 | 8 | 0 / 1 |

## Schema Changes

### Summary of Schema Changes
#### Registry versions
Baseline: 0.1.0

Head: 0.1.0

#### Registry Attributes
##### Added
- commit_story.git.diff_size
- commit_story.git.has_previous_commit
- commit_story.git.is_merge
- commit_story.git.operation
- commit_story.git.parent_count
- commit_story.journal.entries_count
- commit_story.journal.summary_saved
- commit_story.mcp.transport
- commit_story.summary.daily_summaries_count
- commit_story.summary.dates_requested
- commit_story.summary.days_failed_count
- commit_story.summary.days_generated_count
- commit_story.summary.force
- commit_story.summary.mode
- commit_story.summary.month_label
- commit_story.summary.months_failed_count
- commit_story.summary.months_generated_count
- commit_story.summary.summarized_months_count
- commit_story.summary.unsummarized_days_count
- commit_story.summary.unsummarized_months_count
- commit_story.summary.unsummarized_weeks_count
- commit_story.summary.week_label
- commit_story.summary.weekly_summaries_count
- commit_story.summary.weeks_failed_count
- commit_story.summary.weeks_generated_count

### New Span IDs

**src/collectors/claude-collector.js**
- `span.commit_story.context.collect_chat_messages`

**src/collectors/git-collector.js**
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.run`

**src/integrators/context-integrator.js**
- `span.commit_story.context.gather_context_for_commit`

**src/generators/journal-graph.js**
- `span.commit_story.journal.dialogue_node`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.summary_node`
- `span.commit_story.journal.technical_node`

**src/generators/summary-graph.js**
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.generate_monthly_summary`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.weekly_summary_node`

**src/mcp/server.js**
- `span.commit_story.mcp.start`

**src/utils/journal-paths.js**
- `span.commit_story.journal.ensure_directory`

**src/managers/journal-manager.js**
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.save_entry`

**src/managers/summary-manager.js**
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.monthly_summary_pipeline`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.save_weekly_summary`

**src/commands/summarize.js**
- `span.commit_story.journal.run_monthly_summarize`
- `span.commit_story.journal.run_summarize`
- `span.commit_story.journal.run_weekly_summarize`

**src/utils/summary-detector.js**
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.find_unsummarized_months`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`

**src/managers/auto-summarize.js**
- `span.commit_story.journal.trigger_auto_monthly_summaries`
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`

**src/index.js**
- `span.commit_story.cli.main`
- `span.commit_story.journal.handle_summarize`

### New Attribute Extensions

**src/collectors/git-collector.js**
- `commit_story.git.diff_size`
- `commit_story.git.has_previous_commit`
- `commit_story.git.is_merge`
- `commit_story.git.operation`
- `commit_story.git.parent_count`

**src/generators/summary-graph.js**
- `commit_story.journal.entries_count`
- `commit_story.summary.daily_summaries_count`
- `commit_story.summary.month_label`
- `commit_story.summary.week_label`
- `commit_story.summary.weekly_summaries_count`

**src/mcp/server.js**
- `commit_story.mcp.transport`

**src/managers/summary-manager.js**
- `commit_story.journal.summary_saved`

**src/commands/summarize.js**
- `commit_story.summary.dates_requested`
- `commit_story.summary.force`
- `commit_story.summary.months_failed_count`
- `commit_story.summary.months_generated_count`

**src/utils/summary-detector.js**
- `commit_story.summary.summarized_months_count`
- `commit_story.summary.unsummarized_days_count`
- `commit_story.summary.unsummarized_months_count`
- `commit_story.summary.unsummarized_weeks_count`

**src/managers/auto-summarize.js**
- `commit_story.summary.days_failed_count`
- `commit_story.summary.days_generated_count`
- `commit_story.summary.weeks_failed_count`
- `commit_story.summary.weeks_generated_count`

**src/index.js**
- `commit_story.summary.mode`

## Review Attention

- **src/utils/summary-detector.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 230, 231)

**src/collectors/git-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 78, 213, 214)

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 45, 46, 67, 68, 110, 111)

**src/mcp/tools/context-capture-tool.js**
- COV-004 (Async Operation Spans):69: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans):65: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 183, 434)

**src/managers/summary-manager.js**
- COV-004 (Async Operation Spans):30: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 151, 213, 239, 334, 400, 457, 600, 739, 774)

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 435, 522)

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 95, 132, 155, 207, 245, 268, 371, 394)

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 29, 122, 186)
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/index.js**
- CDQ-007 (Attribute Data Quality):208: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.

## Agent Notes

Each instrumented file has a companion `.instrumentation.md` file in the same directory (e.g., `src/api.js` → `src/api.instrumentation.md`) containing the agent's full decision notes.

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@opentelemetry/instrumentation-pino`
- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-mcp`

> **Important**: Initialize these packages **inside your application code**, not via `--import`. Loading them through `--import` can install a competing ESM hook registry alongside the one already registered by your OTel SDK, causing spans to be created but silently dropped — the exporter reports success but data never reaches the backend.

## SDK Bootstrap Checklist

Verify that your SDK init file includes all required resource attributes. Missing attributes reduce observability and cause RES-001 compliance failures.

```javascript
import { randomUUID } from 'node:crypto';

resource: resourceFromAttributes({
  'service.name': 'your-service-name',
  'service.version': process.env.npm_package_version || '0.0.0',
  'service.instance.id': randomUUID(),
}),
```

> **`service.instance.id`** uniquely identifies a running process instance. Without it, traces from different deployments share identical resource metadata — spans are indistinguishable across restarts and parallel processes.

## Token Usage

| | Ceiling | Actual |
|---|---------|--------|
| **Cost** | $74.88 | $7.23 (claude-sonnet-4-6) |
| **Input tokens** | 3,200,000 | 181,788 |
| **Output tokens** | — | 297,149 |
| **Cache read tokens** | — | 422,661 |
| **Cache write tokens** | — | 561,105 |

Model: `claude-sonnet-4-6` | Files: 32 | Total file size: 212,098 bytes

## Live-Check Compliance

Live-Check: OK (730 spans, 5597 advisory findings — see compliance report)

Full compliance report: [spiny-orb-live-check-report.json](./spiny-orb-live-check-report.json)

## Agent Version

`2.0.0`