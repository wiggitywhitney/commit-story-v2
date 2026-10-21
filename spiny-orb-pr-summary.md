## Summary

- **Files processed**: 32
- **Committed**: 14
- **No changes needed**: 18

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.20 | — | 1 (see Schema Changes) |
| src/collectors/git-collector.js | success | 6 | 1 | $0.24 | — | 11 (see Schema Changes) |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.28 | — | 1 (see Schema Changes) |
| src/generators/journal-graph.js | success | 4 | 3 | $2.15 | `@traceloop/instrumentation-langchain` | 6 (see Schema Changes) |
| src/generators/summary-graph.js | success | 6 | 3 | $1.09 | `@traceloop/instrumentation-langchain` | 9 (see Schema Changes) |
| src/mcp/tools/context-capture-tool.js | success | 3 | 1 | $0.20 | `@traceloop/instrumentation-mcp` | 3 (see Schema Changes) |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp`, `@opentelemetry/instrumentation-pino` | 2 (see Schema Changes) |
| src/utils/journal-paths.js | success | 1 | 1 | $0.23 | — | 1 (see Schema Changes) |
| src/managers/journal-manager.js | success | 2 | 1 | $0.49 | — | 3 (see Schema Changes) |
| src/managers/summary-manager.js | success | 10 | 2 | $0.76 | — | 10 (see Schema Changes) |
| src/commands/summarize.js | success | 3 | 1 | $0.36 | — | 9 (see Schema Changes) |
| src/utils/summary-detector.js | success | 9 | 1 | $0.36 | — | 10 (see Schema Changes) |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.24 | — | 3 (see Schema Changes) |
| src/index.js | success | 2 | 1 | $0.38 | — | 2 (see Schema Changes) |

**No changes needed** (18 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

*Self-reported by the LLM, not independently verified against the diff. "External Calls" counts manually-wrapped spans only — calls covered by an auto-instrumentation library are not included.*

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions | Attrs Reused / New |
|------|---------------|----------------|---------------------|-----------------|---------------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 | 0 / 0 |
| src/collectors/git-collector.js | 0 | 0 | 2 | 6 | 0 / 5 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 | 0 / 0 |
| src/generators/journal-graph.js | not reported | not reported | not reported | not reported | 0 / 2 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 | 7 / 3 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 6 | 0 / 1 |
| src/mcp/server.js | 0 | 0 | 1 | 2 | 0 / 1 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 | 0 / 0 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 | 0 / 1 |
| src/managers/summary-manager.js | 0 | 0 | 9 | 15 | 0 / 0 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 | 0 / 6 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 | 0 / 1 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 | 0 / 0 |
| src/index.js | 0 | 0 | 2 | 8 | 0 / 0 |

## Schema Changes

### Summary of Schema Changes
#### Registry versions
Baseline: 0.1.0

Head: 0.1.0

#### Registry Attributes
##### Added
- commit_story.context.content_length
- commit_story.git.command
- commit_story.git.diff_size
- commit_story.git.has_previous_commit
- commit_story.git.is_merge
- commit_story.git.parent_count
- commit_story.journal.has_chat_context
- commit_story.journal.has_functional_code
- commit_story.journal.reflections_count
- commit_story.mcp.transport_type
- commit_story.summary.base_path
- commit_story.summary.dates_count
- commit_story.summary.entries_count
- commit_story.summary.failed_count
- commit_story.summary.force
- commit_story.summary.generated_count
- commit_story.summary.month_label
- commit_story.summary.months_count
- commit_story.summary.week_label
- commit_story.summary.weeks_count

### New Span IDs

**src/collectors/claude-collector.js**
- `span.commit_story.context.collect_chat_messages`

**src/collectors/git-collector.js**
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.run_command`

**src/integrators/context-integrator.js**
- `span.commit_story.context.gather_context`

**src/generators/journal-graph.js**
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical_decisions`

**src/generators/summary-graph.js**
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.generate_monthly`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.weekly_node`

**src/mcp/tools/context-capture-tool.js**
- `span.commit_story.context.save_context`
- `span.commit_story.mcp.capture_context`

**src/mcp/server.js**
- `span.commit_story.mcp.server_start`

**src/utils/journal-paths.js**
- `span.commit_story.journal.ensure_directory`

**src/managers/journal-manager.js**
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.save_entry`

**src/managers/summary-manager.js**
- `span.commit_story.summary.check_existing`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.generate_and_save_monthly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.read_month_summaries`
- `span.commit_story.summary.read_week_summaries`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.save_weekly`

**src/commands/summarize.js**
- `span.commit_story.summary.run_monthly_summarize`
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`

**src/utils/summary-detector.js**
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.get_summarized_days`
- `span.commit_story.summary.get_summarized_months`
- `span.commit_story.summary.get_summarized_weeks`
- `span.commit_story.summary.get_weeks_with_weekly_summaries`

**src/managers/auto-summarize.js**
- `span.commit_story.summary.trigger_auto_monthly_summaries`
- `span.commit_story.summary.trigger_auto_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`

**src/index.js**
- `span.commit_story.cli.main`
- `span.commit_story.summary.handle_summarize`

### New Attribute Extensions

**src/collectors/git-collector.js**
- `commit_story.git.command`
- `commit_story.git.diff_size`
- `commit_story.git.has_previous_commit`
- `commit_story.git.is_merge`
- `commit_story.git.parent_count`

**src/generators/journal-graph.js**
- `commit_story.journal.has_chat_context`
- `commit_story.journal.has_functional_code`

**src/generators/summary-graph.js**
- `commit_story.summary.entries_count`
- `commit_story.summary.month_label`
- `commit_story.summary.week_label`

**src/mcp/tools/context-capture-tool.js**
- `commit_story.context.content_length`

**src/mcp/server.js**
- `commit_story.mcp.transport_type`

**src/managers/journal-manager.js**
- `commit_story.journal.reflections_count`

**src/commands/summarize.js**
- `commit_story.summary.dates_count`
- `commit_story.summary.failed_count`
- `commit_story.summary.force`
- `commit_story.summary.generated_count`
- `commit_story.summary.months_count`
- `commit_story.summary.weeks_count`

**src/utils/summary-detector.js**
- `commit_story.summary.base_path`

## Review Attention

- **src/managers/summary-manager.js**: 10 spans added (average: 4) — outlier, review recommended
- **src/utils/summary-detector.js**: 9 spans added (average: 4) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 230, 231)

**src/collectors/git-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 213, 214)

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 44, 62, 63, 64, 68)

**src/generators/journal-graph.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 465, 520)

**src/mcp/tools/context-capture-tool.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 85, 118)

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans):65: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality):94: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 183, 187, 189)

**src/managers/summary-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 28, 135, 200, 345, 410, 568, 633)
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 63, 95, 115, 132, 154, 170, 190, 207, 227, 245, 267, 296, 316, 333, 353, 371, 393, 434)

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 26, 30, 119, 123, 183, 187)

**src/index.js**
- CDQ-007 (Attribute Data Quality):462: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

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
| **Cost** | $74.88 | $7.21 (claude-sonnet-4-6) |
| **Input tokens** | 3,200,000 | 204,387 |
| **Output tokens** | — | 292,999 |
| **Cache read tokens** | — | 298,206 |
| **Cache write tokens** | — | 564,618 |

Model: `claude-sonnet-4-6` | Files: 32 | Total file size: 212,098 bytes

## Live-Check Compliance

Live-Check: OK (866 spans, 5738 advisory findings — see compliance report)

Full compliance report: [spiny-orb-live-check-report.json](./spiny-orb-live-check-report.json)

## Agent Version

`1.0.0`