## Summary

- **Files processed**: 32
- **Committed**: 13
- **No changes needed**: 18
- **Partial**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.24 | — | 2 (see Schema Changes) |
| src/collectors/git-collector.js | success | 6 | 2 | $0.50 | — | 8 (see Schema Changes) |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.27 | — | 1 (see Schema Changes) |
| src/generators/journal-graph.js | success | 4 | 3 | $2.29 | `@traceloop/instrumentation-langchain` | 7 (see Schema Changes) |
| src/generators/summary-graph.js | success | 6 | 2 | $0.78 | `@traceloop/instrumentation-langchain` | 9 (see Schema Changes) |
| src/mcp/tools/context-capture-tool.js | success | 3 | 1 | $0.18 | — | 2 (see Schema Changes) |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp`, `@opentelemetry/instrumentation-pino` | 2 (see Schema Changes) |
| src/utils/journal-paths.js | success | 1 | 1 | $0.21 | — | 1 (see Schema Changes) |
| src/managers/journal-manager.js | success | 2 | 1 | $0.44 | — | 2 (see Schema Changes) |
| src/managers/summary-manager.js | partial (12/14 functions) | 7 | 2 | $1.87 | — | 7 (see Schema Changes) |
| src/commands/summarize.js | success | 3 | 3 | $1.49 | — | 6 (see Schema Changes) |
| src/utils/summary-detector.js | success | 9 | 1 | $0.33 | — | 10 (see Schema Changes) |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.25 | — | 3 (see Schema Changes) |
| src/index.js | success | 2 | 1 | $0.32 | — | 2 (see Schema Changes) |

**No changes needed** (18 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

*Self-reported by the LLM, not independently verified against the diff. "External Calls" counts manually-wrapped spans only — calls covered by an auto-instrumentation library are not included.*

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions | Attrs Reused / New |
|------|---------------|----------------|---------------------|-----------------|---------------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 | 0 / 1 |
| src/collectors/git-collector.js | 1 | 0 | 2 | 6 | 0 / 2 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 | 0 / 0 |
| src/generators/journal-graph.js | not reported | not reported | not reported | not reported | 0 / 3 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 | 0 / 3 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 2 | 6 | 0 / 0 |
| src/mcp/server.js | 0 | 0 | 1 | 2 | 0 / 1 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 13 | 0 / 0 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 | 0 / 0 |
| src/managers/summary-manager.js | not reported | not reported | not reported | not reported | 0 / 0 |
| src/commands/summarize.js | not reported | not reported | not reported | not reported | 0 / 3 |
| src/utils/summary-detector.js | 0 | 0 | 9 | 11 | 0 / 1 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 | 0 / 0 |
| src/index.js | 0 | 0 | 2 | 8 | 0 / 0 |

## Schema Changes

### Summary of Schema Changes
#### Registry versions
Baseline: 0.1.0

Head: 0.1.0

#### Registry Attributes
##### Added
- commit_story.ai.max_quotes
- commit_story.ai.substantial_messages_count
- commit_story.context.repo_path
- commit_story.git.diff_size
- commit_story.git.parent_count
- commit_story.journal.dates_count
- commit_story.journal.errors_count
- commit_story.journal.force
- commit_story.journal.weeks_count
- commit_story.mcp.transport
- commit_story.summary.entry_count
- commit_story.summary.month_label
- commit_story.summary.months_count
- commit_story.summary.week_label

### New Span IDs

**src/collectors/claude-collector.js**
- `span.commit_story.context.collect`

**src/collectors/git-collector.js**
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_commit_diff`
- `span.commit_story.git.get_commit_metadata`
- `span.commit_story.git.get_merge_info`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.git.run_command`

**src/integrators/context-integrator.js**
- `span.commit_story.context.gather_for_commit`

**src/generators/journal-graph.js**
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.ai.generate_journal_sections`
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`

**src/generators/summary-graph.js**
- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.generate_monthly_summary`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.ai.run_daily_summary_graph`
- `span.commit_story.ai.run_monthly_summary_graph`
- `span.commit_story.ai.run_weekly_summary_graph`

**src/mcp/tools/context-capture-tool.js**
- `span.commit_story.context.save_context`
- `span.commit_story.mcp.capture_context`

**src/mcp/server.js**
- `span.commit_story.mcp.server.start`

**src/utils/journal-paths.js**
- `span.commit_story.journal.ensure_directory`

**src/managers/journal-manager.js**
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.save_entry`

**src/managers/summary-manager.js**
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.generate_and_save_monthly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
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
- `span.commit_story.cli.handle_summarize`
- `span.commit_story.cli.main`

### New Attribute Extensions

**src/collectors/claude-collector.js**
- `commit_story.context.repo_path`

**src/collectors/git-collector.js**
- `commit_story.git.diff_size`
- `commit_story.git.parent_count`

**src/generators/journal-graph.js**
- `commit_story.ai.max_quotes`
- `commit_story.ai.substantial_messages_count`
- `commit_story.journal.errors_count`

**src/generators/summary-graph.js**
- `commit_story.summary.entry_count`
- `commit_story.summary.month_label`
- `commit_story.summary.week_label`

**src/mcp/server.js**
- `commit_story.mcp.transport`

**src/commands/summarize.js**
- `commit_story.journal.dates_count`
- `commit_story.journal.force`
- `commit_story.summary.months_count`

**src/utils/summary-detector.js**
- `commit_story.journal.weeks_count`

## Review Attention

- **src/utils/summary-detector.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 196, 231, 232)

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 42, 47, 65, 66, 67, 72)

**src/generators/journal-graph.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 464, 525, 599)

**src/generators/summary-graph.js**
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/mcp/tools/context-capture-tool.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 77, 117)

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans):65: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality):94: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 183, 187, 431)

**src/managers/summary-manager.js**
- COV-004 (Async Operation Spans):30: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 125, 127, 168, 206, 207, 284, 309, 369, 375, 415, 438, 464, 627, 641, 671, 690, 722)

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 329, 436, 437)

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 63, 95, 115, 132, 154, 170, 190, 227, 245, 267, 316, 333, 353, 393, 434)
- SCH-001 (Span Names Match Registry): Fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported. (lines 26, 30, 120, 124, 185, 189)

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
| **Cost** | $74.88 | $9.40 (claude-sonnet-4-6) |
| **Input tokens** | 3,200,000 | 272,257 |
| **Output tokens** | — | 356,121 |
| **Cache read tokens** | — | 515,235 |
| **Cache write tokens** | — | 823,701 |

Model: `claude-sonnet-4-6` | Files: 32 | Total file size: 212,098 bytes

## Live-Check Compliance

Live-Check: OK (663 spans, 4808 advisory findings — see compliance report)

Full compliance report: [spiny-orb-live-check-report.json](./spiny-orb-live-check-report.json)

## Agent Version

`2.0.0`