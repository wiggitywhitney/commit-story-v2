## Summary

- **Files processed**: 32
- **Committed**: 12
- **No changes needed**: 17
- **Abandoned after failure (needs review)**: 1
- **Failed**: 1
- **Partial**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.33 | — | 2 (see Schema Changes) |
| src/collectors/git-collector.js | success | 2 | 3 | $0.79 | — | 3 (see Schema Changes) |
| src/integrators/context-integrator.js | success | 1 | 3 | $0.49 | — | 1 (see Schema Changes) |
| src/generators/journal-graph.js | success | 4 | 2 | $0.84 | `@traceloop/instrumentation-langchain` | 5 (see Schema Changes) |
| src/generators/summary-graph.js | failed: Validation failed: NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 187: if (result.response_metadata?.model != null) The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 | 3 | $1.24 | — | — |
| src/mcp/tools/context-capture-tool.js | success | 1 | 1 | $0.07 | — | 2 (see Schema Changes) |
| src/mcp/tools/reflection-tool.js | abandoned after failure (needs review) | 0 | 2 | $0.22 | — | — |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp`, `@opentelemetry/instrumentation-pino` | 2 (see Schema Changes) |
| src/utils/journal-paths.js | success | 1 | 1 | $0.28 | — | 1 (see Schema Changes) |
| src/managers/journal-manager.js | success | 2 | 1 | $0.40 | — | 4 (see Schema Changes) |
| src/managers/summary-manager.js | success | 9 | 3 | $2.35 | — | 15 (see Schema Changes) |
| src/commands/summarize.js | success | 3 | 2 | $0.64 | — | 4 (see Schema Changes) |
| src/utils/summary-detector.js | success | 5 | 2 | $0.57 | — | 6 (see Schema Changes) |
| src/managers/auto-summarize.js | success | 3 | 3 | $0.61 | — | 3 (see Schema Changes) |
| src/index.js | partial (2/2 functions) | 2 | 2 | $1.06 | — | 7 (see Schema Changes) |

**No changes needed** (17 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

*Self-reported by the LLM, not independently verified against the diff. "External Calls" counts manually-wrapped spans only — calls covered by an auto-instrumentation library are not included.*

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions | Attrs Reused / New |
|------|---------------|----------------|---------------------|-----------------|---------------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 | 0 / 1 |
| src/collectors/git-collector.js | not reported | not reported | not reported | not reported | 0 / 1 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 | 0 / 0 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 | 0 / 1 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 5 | 0 / 1 |
| src/mcp/server.js | 0 | 0 | 1 | 2 | 0 / 1 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 | 0 / 0 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 | 0 / 2 |
| src/managers/summary-manager.js | not reported | not reported | not reported | not reported | 0 / 6 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 | 0 / 1 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 | 0 / 1 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 | 0 / 0 |
| src/index.js | not reported | not reported | not reported | not reported | 0 / 5 |

## Schema Changes

### Summary of Schema Changes
#### Registry versions
Baseline: 0.1.0

Head: 0.1.0

#### Registry Attributes
##### Added
- commit_story.context.files_count
- commit_story.context.text_length
- commit_story.git.has_previous_commit
- commit_story.journal.daily_summaries_count
- commit_story.journal.entries_count
- commit_story.journal.entry_action
- commit_story.journal.errors_count
- commit_story.journal.force
- commit_story.journal.month
- commit_story.journal.reflections_count
- commit_story.journal.week
- commit_story.journal.weekly_summaries_count
- commit_story.mcp.transport
- commit_story.summarize.before_date
- commit_story.summarize.dates_count
- commit_story.summarize.failed_count
- commit_story.summarize.generated_count
- commit_story.summarize.mode
- commit_story.summarize.months_count
- commit_story.summarize.weeks_count

### New Span IDs

**src/collectors/claude-collector.js**
- `span.commit_story.context.collect_chat_messages`

**src/collectors/git-collector.js**
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`

**src/integrators/context-integrator.js**
- `span.commit_story.context.gather_for_commit`

**src/generators/journal-graph.js**
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `span.commit_story.journal.generate_sections`

**src/mcp/tools/context-capture-tool.js**
- `span.commit_story.context.save_context`

**src/mcp/server.js**
- `span.commit_story.mcp.start_server`

**src/utils/journal-paths.js**
- `span.commit_story.journal.ensure_directory`

**src/managers/journal-manager.js**
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.save_entry`

**src/managers/summary-manager.js**
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.generate_and_save_monthly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.save_weekly_summary`

**src/commands/summarize.js**
- `span.commit_story.summarize.run_daily`
- `span.commit_story.summarize.run_monthly`
- `span.commit_story.summarize.run_weekly`

**src/utils/summary-detector.js**
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.find_unsummarized_months`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.get_days_with_entries`

**src/managers/auto-summarize.js**
- `span.commit_story.summarize.trigger_auto`
- `span.commit_story.summarize.trigger_auto_monthly`
- `span.commit_story.summarize.trigger_auto_weekly`

**src/index.js**
- `span.commit_story.cli.handle_summarize`
- `span.commit_story.cli.main`

### New Attribute Extensions

**src/collectors/claude-collector.js**
- `commit_story.context.files_count`

**src/collectors/git-collector.js**
- `commit_story.git.has_previous_commit`

**src/generators/journal-graph.js**
- `commit_story.journal.errors_count`

**src/mcp/tools/context-capture-tool.js**
- `commit_story.context.text_length`

**src/mcp/server.js**
- `commit_story.mcp.transport`

**src/managers/journal-manager.js**
- `commit_story.journal.entry_action`
- `commit_story.journal.reflections_count`

**src/managers/summary-manager.js**
- `commit_story.journal.daily_summaries_count`
- `commit_story.journal.entries_count`
- `commit_story.journal.force`
- `commit_story.journal.month`
- `commit_story.journal.week`
- `commit_story.journal.weekly_summaries_count`

**src/commands/summarize.js**
- `commit_story.summarize.dates_count`

**src/utils/summary-detector.js**
- `commit_story.summarize.before_date`

**src/index.js**
- `commit_story.summarize.failed_count`
- `commit_story.summarize.generated_count`
- `commit_story.summarize.mode`
- `commit_story.summarize.months_count`
- `commit_story.summarize.weeks_count`

## Review Attention

- **src/utils/summary-detector.js**: 5 spans added (average: 2) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 220, 234, 235)

**src/collectors/git-collector.js**
- COV-004 (Async Operation Spans): Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers. (lines 23, 51, 89, 114)

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 63, 64, 65, 66)

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans):65: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 181, 445)

**src/managers/summary-manager.js**
- COV-004 (Async Operation Spans):30: Fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way. (lines 89, 222, 360, 493, 647, 721, 785)

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality):29: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.

**src/index.js**
- CDQ-007 (Attribute Data Quality):591: Fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. For the path finding, prefer basename() when already imported, or inline filePath.split(/[\\/]/).filter(Boolean).pop() ?? '' otherwise — no new import required either way.

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
| **Cost** | $99.84 | $9.94 (claude-opus-5-5) |
| **Input tokens** | 3,200,000 | 324,494 |
| **Output tokens** | — | 263,875 |
| **Cache read tokens** | — | 899,070 |
| **Cache write tokens** | — | 636,239 |

Model: `claude-opus-5-5` | Files: 32 | Total file size: 212,068 bytes

## Live-Check Compliance

Live-Check: OK (570 spans, 5172 advisory findings — see compliance report)

Full compliance report: [spiny-orb-live-check-report.json](./spiny-orb-live-check-report.json)

## Agent Version

`2.0.0`

## Warnings

- File failed: src/generators/summary-graph.js — Validation failed: NDS-003, NDS-003, NDS-003 — NDS-003: non-instrumentation line added at instrumented line 187: if (result.response_metadata?.model != null)
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If you collapsed a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.
- Live-check partial: 1 file(s) failed instrumentation (src/generators/summary-graph.js). Compliance report may be incomplete — spans from failed files are missing. This warning is advisory — the run completed; successfully instrumented files are unaffected. To get full coverage, review the failed files above and re-run spiny-orb on them.