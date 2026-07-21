## Summary

- **Files processed**: 32
- **Committed**: 14
- **No changes needed**: 18

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.21 | — | 1 (see Schema Changes) |
| src/collectors/git-collector.js | success | 6 | 3 | $0.64 | — | 11 (see Schema Changes) |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.27 | — | 1 (see Schema Changes) |
| src/generators/journal-graph.js | success | 4 | 2 | $0.79 | `@traceloop/instrumentation-langchain`, `@traceloop/instrumentation-anthropic` | 4 (see Schema Changes) |
| src/generators/summary-graph.js | success | 6 | 2 | $0.67 | `@traceloop/instrumentation-langchain` | 9 (see Schema Changes) |
| src/mcp/tools/context-capture-tool.js | success | 3 | 1 | $0.17 | — | 2 (see Schema Changes) |
| src/mcp/server.js | success | 1 | 1 | $0.06 | `@traceloop/instrumentation-mcp`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/instrumentation-pino` | 2 (see Schema Changes) |
| src/utils/journal-paths.js | success | 1 | 1 | $0.21 | — | 1 (see Schema Changes) |
| src/managers/journal-manager.js | success | 2 | 1 | $0.42 | — | 2 (see Schema Changes) |
| src/managers/summary-manager.js | success | 9 | 2 | $1.91 | — | 11 (see Schema Changes) |
| src/commands/summarize.js | success | 3 | 2 | $1.48 | — | 4 (see Schema Changes) |
| src/utils/summary-detector.js | success | 9 | 1 | $0.36 | — | 10 (see Schema Changes) |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.28 | — | 6 (see Schema Changes) |
| src/index.js | success | 2 | 1 | $0.34 | — | 2 (see Schema Changes) |

**No changes needed** (18 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

*Self-reported by the LLM, not independently verified against the diff. "External Calls" counts manually-wrapped spans only — calls covered by an auto-instrumentation library are not included.*

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions | Attrs Reused / New |
|------|---------------|----------------|---------------------|-----------------|---------------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 | 0 / 0 |
| src/collectors/git-collector.js | 1 | 0 | 2 | 6 | 0 / 5 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 | 0 / 0 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 | 0 / 0 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 | 0 / 3 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 6 | 0 / 0 |
| src/mcp/server.js | 0 | 0 | 1 | 2 | 0 / 1 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 | 0 / 0 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 | 0 / 0 |
| src/managers/summary-manager.js | not reported | not reported | not reported | not reported | 0 / 2 |
| src/commands/summarize.js | not reported | not reported | not reported | not reported | 0 / 1 |
| src/utils/summary-detector.js | 0 | 0 | 9 | 11 | 0 / 1 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 | 0 / 3 |
| src/index.js | 0 | 0 | 2 | 8 | 0 / 0 |

## Schema Changes

### Summary of Schema Changes
#### Registry versions
Baseline: 0.1.0

Head: 0.1.0

#### Registry Attributes
##### Added
- commit_story.git.command
- commit_story.git.diff_lines
- commit_story.git.is_first_commit
- commit_story.git.is_merge
- commit_story.git.parent_count
- commit_story.journal.dates_count
- commit_story.journal.entries_count
- commit_story.journal.failed_count
- commit_story.journal.force_overwrite
- commit_story.journal.generated_count
- commit_story.journal.month_label
- commit_story.journal.months_count
- commit_story.journal.skipped_count
- commit_story.journal.week_count
- commit_story.journal.week_label
- commit_story.mcp.transport_type

### New Span IDs

**src/collectors/claude-collector.js**
- `span.commit_story.context.collect_chat_messages`

**src/collectors/git-collector.js**
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.run_git`

**src/integrators/context-integrator.js**
- `span.commit_story.context.gather_for_commit`

**src/generators/journal-graph.js**
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`

**src/generators/summary-graph.js**
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.generate_monthly_summary`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.weekly_summary_node`

**src/mcp/tools/context-capture-tool.js**
- `span.commit_story.context.save_context`
- `span.commit_story.mcp.capture_context`

**src/mcp/server.js**
- `span.commit_story.mcp.start_server`

**src/utils/journal-paths.js**
- `span.commit_story.journal.ensure_directory`

**src/managers/journal-manager.js**
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.save_entry`

**src/managers/summary-manager.js**
- `span.commit_story.journal.daily_summary_pipeline`
- `span.commit_story.journal.generate_and_save_monthly_summary`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.read_week_summaries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.weekly_summary_pipeline`

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
- `commit_story.git.command`
- `commit_story.git.diff_lines`
- `commit_story.git.is_first_commit`
- `commit_story.git.is_merge`
- `commit_story.git.parent_count`

**src/generators/summary-graph.js**
- `commit_story.journal.entries_count`
- `commit_story.journal.month_label`
- `commit_story.journal.week_label`

**src/mcp/server.js**
- `commit_story.mcp.transport_type`

**src/managers/summary-manager.js**
- `commit_story.journal.force_overwrite`
- `commit_story.journal.week_count`

**src/commands/summarize.js**
- `commit_story.journal.dates_count`

**src/utils/summary-detector.js**
- `commit_story.journal.months_count`

**src/managers/auto-summarize.js**
- `commit_story.journal.failed_count`
- `commit_story.journal.generated_count`
- `commit_story.journal.skipped_count`

## Review Attention

- **src/utils/summary-detector.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 230, 231)

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 113, 115, 116, 117, 118, 119, 120)

**src/mcp/tools/context-capture-tool.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 85, 116)

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans):65: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality):94: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 182, 183, 428)

**src/managers/summary-manager.js**
- COV-004 (Async Operation Spans):30: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 55, 148, 216, 234, 328, 392, 400, 462, 488, 674, 715, 771)

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 427, 521)

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 94, 130, 167, 203, 240, 290, 363)
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 29, 124, 189)

**src/index.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 466, 472)

## Agent Notes

Each instrumented file has a companion `.instrumentation.md` file in the same directory (e.g., `src/api.js` → `src/api.instrumentation.md`) containing the agent's full decision notes.

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@opentelemetry/instrumentation-pino`
- `@traceloop/instrumentation-langchain`
- `@traceloop/instrumentation-anthropic`
- `@traceloop/instrumentation-mcp`
- `@opentelemetry/auto-instrumentations-node`

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
| **Cost** | $74.88 | $7.96 (claude-sonnet-4-6) |
| **Input tokens** | 3,200,000 | 258,675 |
| **Output tokens** | — | 292,611 |
| **Cache read tokens** | — | 443,884 |
| **Cache write tokens** | — | 708,716 |

Model: `claude-sonnet-4-6` | Files: 32 | Total file size: 212,098 bytes

## Live-Check Compliance

Live-Check: OK (736 spans, 5735 advisory findings — see compliance report)

Full compliance report: [spiny-orb-live-check-report.json](./spiny-orb-live-check-report.json)

## Agent Version

`1.0.0`