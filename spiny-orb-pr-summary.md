## Summary

- **Files processed**: 30
- **Committed**: 10
- **No changes needed**: 14
- **Failed**: 3
- **Partial**: 3

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 2 | $0.29 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 1 | 2 | $0.19 | — | `span.commit_story.git.get_previous_commit_time` |
| src/generators/journal-graph.js | partial (11/12 functions) | 3 | 3 | $2.30 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_summary`, `span.commit_story.ai.generate_dialogue`, `span.commit_story.ai.generate_journal_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $1.69 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_daily_summary`, `commit_story.journal.entries_count`, `span.commit_story.journal.generate_daily_summary`, `span.commit_story.ai.generate_weekly_summary`, `span.commit_story.journal.generate_weekly_summary`, `commit_story.journal.week_label`, `span.commit_story.ai.generate_monthly_summary`, `commit_story.journal.month_label`, `span.commit_story.journal.generate_monthly_summary` |
| src/integrators/context-integrator.js | success | 1 | 3 | $0.90 | — | `span.commit_story.context.gather_for_commit` |
| src/mcp/tools/context-capture-tool.js | failed: LLM response had null parsed_output — no structured output was returned. stop_reason: max_tokens output_tokens: 20200 raw_preview: <no text content> | 0 | 3 | $0.45 | — | — |
| src/mcp/tools/reflection-tool.js | failed: LLM response had null parsed_output — no structured output was returned. stop_reason: max_tokens output_tokens: 19400 raw_preview: <no text content> | 0 | 3 | $0.37 | — | — |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.start`, `commit_story.mcp.transport` |
| src/utils/commit-analyzer.js | partial (2/2 functions) | 0 | 3 | $0.00 | — | — |
| src/utils/journal-paths.js | success | 1 | 1 | $0.17 | — | `span.commit_story.journal.ensure_directory` |
| src/managers/journal-manager.js | success | 2 | 3 | $1.22 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | partial (12/14 functions) | 7 | 2 | $2.28 | — | `span.commit_story.journal.read_day_entries`, `span.commit_story.journal.save_daily_summary`, `span.commit_story.journal.generate_and_save_daily_summary`, `span.commit_story.journal.read_week_daily_summaries`, `span.commit_story.journal.save_weekly_summary`, `span.commit_story.journal.read_month_weekly_summaries`, `span.commit_story.journal.save_monthly_summary` |
| src/commands/summarize.js | success | 3 | 3 | $1.64 | — | `span.commit_story.journal.run_summarize`, `span.commit_story.journal.run_weekly_summarize`, `commit_story.journal.weeks_count`, `span.commit_story.journal.run_monthly_summarize` |
| src/utils/summary-detector.js | success | 9 | 1 | $0.37 | — | `span.commit_story.journal.get_days_with_entries`, `span.commit_story.journal.get_summarized_days`, `span.commit_story.journal.find_unsummarized_days`, `span.commit_story.journal.get_summarized_weeks`, `span.commit_story.journal.get_days_with_daily_summaries`, `span.commit_story.journal.find_unsummarized_weeks`, `span.commit_story.journal.get_summarized_months`, `span.commit_story.journal.get_weeks_with_weekly_summaries`, `span.commit_story.journal.find_unsummarized_months`, `commit_story.journal.months_count` |
| src/managers/auto-summarize.js | success | 3 | 2 | $0.38 | — | `span.commit_story.journal.trigger_auto_summaries`, `span.commit_story.journal.trigger_auto_weekly_summaries`, `span.commit_story.journal.trigger_auto_monthly_summaries` |
| src/index.js | failed: Anthropic API call failed: terminated | 0 | 1 | $0.00 | — | — |

**No changes needed** (14 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/traceloop-init.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.journal.entries_count
- commit_story.journal.month_label
- commit_story.journal.months_count
- commit_story.journal.week_label
- commit_story.journal.weeks_count
- commit_story.mcp.transport




### New Span IDs (38)

- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.ai.generate_journal_sections`
- `span.commit_story.ai.generate_monthly_summary`
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_for_commit`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.find_unsummarized_months`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.generate_monthly_summary`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.get_summarized_days`
- `span.commit_story.journal.get_summarized_months`
- `span.commit_story.journal.get_summarized_weeks`
- `span.commit_story.journal.get_weeks_with_weekly_summaries`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.run_monthly_summarize`
- `span.commit_story.journal.run_summarize`
- `span.commit_story.journal.run_weekly_summarize`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.save_entry`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.journal.trigger_auto_monthly_summaries`
- `span.commit_story.journal.trigger_auto_summaries`
- `span.commit_story.journal.trigger_auto_weekly_summaries`
- `span.commit_story.mcp.start`

## Review Attention

- **src/utils/summary-detector.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/generators/summary-graph.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "entries.length" at line 210 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "entries.length" at line 283 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dailySummaries.length" at line 436 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dailySummaries.length" at line 512 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeklySummaries.length" at line 685 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeklySummaries.length" at line 765 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "filePath" at line 94 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "entryPath" at line 196 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- CDQ-007 (Attribute Data Quality): setAttribute value "reflections.length" at line 460 accesses a property of "reflections" without a null/undefined guard. If "reflections" can be null or undefined, this will throw at runtime. Add an `if (reflections)` check or use optional chaining (`reflections?.length`).

**src/managers/summary-manager.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "path" at line 226 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- CDQ-007 (Attribute Data Quality): setAttribute value "summaries.length" at line 319 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "summaries.length" at line 555 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "summaryPath" at line 643 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 328 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeks.length" at line 424 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "months.length" at line 510 accesses a property of "months" without a null/undefined guard. If "months" can be null or undefined, this will throw at runtime. Add an `if (months)` check or use optional chaining (`months?.length`).

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 94 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.size" at line 130 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.size`).
- CDQ-007 (Attribute Data Quality): setAttribute value "result.length" at line 167 accesses a property of "result" without a null/undefined guard. If "result" can be null or undefined, this will throw at runtime. Add an `if (result)` check or use optional chaining (`result?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeks.size" at line 203 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.size`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 240 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarized.length" at line 290 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "months.size" at line 326 accesses a property of "months" without a null/undefined guard. If "months" can be null or undefined, this will throw at runtime. Add an `if (months)` check or use optional chaining (`months?.size`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeks.length" at line 363 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarized.length" at line 425 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.get_summarized_days" may be a semantic duplicate of existing registry operation "commit_story.journal.generate_daily_summary". If these operations are equivalent, reuse "commit_story.journal.generate_daily_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.find_unsummarized_days" may be a semantic duplicate of existing registry operation "commit_story.journal.get_days_with_entries". If these operations are equivalent, reuse "commit_story.journal.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.get_summarized_weeks" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.get_days_with_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_days". If these operations are equivalent, reuse "commit_story.journal.get_summarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.find_unsummarized_weeks" may be a semantic duplicate of existing registry operation "commit_story.journal.find_unsummarized_days". If these operations are equivalent, reuse "commit_story.journal.find_unsummarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.get_summarized_months" may be a semantic duplicate of existing registry operation "commit_story.journal.read_month_weekly_summaries". If these operations are equivalent, reuse "commit_story.journal.read_month_weekly_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.get_weeks_with_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_weeks". If these operations are equivalent, reuse "commit_story.journal.get_summarized_weeks" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.find_unsummarized_months" may be a semantic duplicate of existing registry operation "commit_story.journal.get_summarized_months". If these operations are equivalent, reuse "commit_story.journal.get_summarized_months" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/managers/auto-summarize.js**
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.trigger_auto_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.run_summarize". If these operations are equivalent, reuse "commit_story.journal.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.trigger_auto_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.journal.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.trigger_auto_monthly_summaries" may be a semantic duplicate of existing registry operation "commit_story.journal.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.journal.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

## Agent Notes

Each instrumented file has a companion `.instrumentation.md` file in the same directory (e.g., `src/api.js` → `src/api.instrumentation.md`) containing the agent's full decision notes.

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

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
| **Cost** | $70.20 | $12.29 |
| **Input tokens** | 3,000,000 | 387,232 |
| **Output tokens** | — | 549,649 |
| **Cache read tokens** | — | 794,153 |
| **Cache write tokens** | — | 705,205 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

Live-Check: OK (543 spans, 3615 advisory findings — see compliance report)

Full compliance report: `spiny-orb-live-check-report.json`

## Agent Version

`1.0.0`

## Warnings

- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/tools/context-capture-tool.js — LLM response had null parsed_output — no structured output was returned.
stop_reason: max_tokens
output_tokens: 20200
raw_preview: <no text content>
- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/tools/reflection-tool.js — LLM response had null parsed_output — no structured output was returned.
stop_reason: max_tokens
output_tokens: 19400
raw_preview: <no text content>
- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/index.js — Anthropic API call failed: terminated
- Live-check partial: 3 file(s) failed instrumentation (/Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/tools/context-capture-tool.js, /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/tools/reflection-tool.js, /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/index.js). Compliance report may be incomplete — spans from failed files are missing. This warning is advisory — the run completed; successfully instrumented files are unaffected. To get full coverage, review the failed files above and re-run spiny-orb on them.