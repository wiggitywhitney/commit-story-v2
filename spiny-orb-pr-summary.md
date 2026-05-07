## Summary

- **Files processed**: 30
- **Committed**: 14
- **No changes needed**: 16

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.53 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 1 | $0.17 | — | `span.commit_story.git.get_previous_commit_time`, `span.commit_story.git.get_commit_data` |
| src/commands/summarize.js | success | 3 | 1 | $0.51 | — | `span.commit_story.summarize.run_summarize`, `span.commit_story.summarize.run_weekly_summarize`, `span.commit_story.summarize.run_monthly_summarize`, `commit_story.summarize.dates_count`, `commit_story.summarize.weeks_count`, `commit_story.summarize.months_count`, `commit_story.summarize.force`, `commit_story.summarize.generated_count`, `commit_story.summarize.failed_count` |
| src/generators/journal-graph.js | success | 4 | 1 | $0.56 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.generate_summary`, `span.commit_story.journal.generate_technical`, `span.commit_story.journal.generate_dialogue`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $0.69 | `@traceloop/instrumentation-langchain` | `span.commit_story.summary.generate_daily_node`, `span.commit_story.summary.generate_daily`, `span.commit_story.summary.generate_weekly_node`, `span.commit_story.summary.generate_weekly`, `span.commit_story.summary.generate_monthly_node`, `span.commit_story.summary.generate_monthly`, `commit_story.summary.entries_count` |
| src/index.js | success | 1 | 1 | $0.23 | — | `span.commit_story.cli.run` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.39 | — | `span.commit_story.context.gather_context_for_commit` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.17 | — | `span.commit_story.summarize.trigger_auto_summaries`, `span.commit_story.summarize.trigger_auto_weekly_summaries`, `span.commit_story.summarize.trigger_auto_monthly_summaries` |
| src/managers/journal-manager.js | success | 2 | 1 | $1.00 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | success | 9 | 1 | $1.19 | — | `span.commit_story.summary.read_day_entries`, `span.commit_story.summary.save_daily_summary`, `span.commit_story.summary.generate_and_save_daily`, `span.commit_story.summary.read_week_daily_summaries`, `span.commit_story.summary.save_weekly_summary`, `span.commit_story.summary.generate_and_save_weekly`, `span.commit_story.summary.read_month_weekly_summaries`, `span.commit_story.summary.save_monthly_summary`, `span.commit_story.summary.generate_and_save_monthly` |
| src/mcp/server.js | success | 1 | 1 | $0.13 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.server_start`, `commit_story.mcp.transport_type` |
| src/mcp/tools/context-capture-tool.js | success | 1 | 1 | $0.15 | `@traceloop/instrumentation-mcp` | `span.commit_story.context.save_context` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.31 | — | `span.commit_story.journal.ensure_directory` |
| src/utils/summary-detector.js | success | 5 | 1 | $0.25 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `span.commit_story.summary.find_unsummarized_months` |

**No changes needed** (16 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 7 |
| src/collectors/git-collector.js | 0 | 0 | 2 | 6 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 |
| src/index.js | 0 | 0 | 1 | 9 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/managers/summary-manager.js | 0 | 0 | 9 | 14 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 5 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 9 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.mcp.transport_type
- commit_story.summarize.dates_count
- commit_story.summarize.failed_count
- commit_story.summarize.force
- commit_story.summarize.generated_count
- commit_story.summarize.months_count
- commit_story.summarize.weeks_count
- commit_story.summary.entries_count




### New Span IDs (40)

- `span.commit_story.cli.run`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context_for_commit`
- `span.commit_story.context.save_context`
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
- `span.commit_story.summarize.trigger_auto_monthly_summaries`
- `span.commit_story.summarize.trigger_auto_summaries`
- `span.commit_story.summarize.trigger_auto_weekly_summaries`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.generate_and_save_monthly`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.generate_daily_node`
- `span.commit_story.summary.generate_monthly`
- `span.commit_story.summary.generate_monthly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.generate_weekly_node`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.save_weekly_summary`

## Review Attention

- **src/generators/summary-graph.js**: 6 spans added (average: 3) — outlier, review recommended
- **src/managers/summary-manager.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "sessions.size" at line 230 accesses a property of "sessions" without a null/undefined guard. If "sessions" can be null or undefined, this will throw at runtime. Add an `if (sessions)` check or use optional chaining (`sessions?.size`).
- CDQ-007 (Attribute Data Quality): setAttribute value "allMessages.length" at line 231 accesses a property of "allMessages" without a null/undefined guard. If "allMessages" can be null or undefined, this will throw at runtime. Add an `if (allMessages)` check or use optional chaining (`allMessages?.length`).

**src/collectors/git-collector.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "metadata.subject" at line 158 accesses a property of "metadata" without a null/undefined guard. If "metadata" can be null or undefined, this will throw at runtime. Add an `if (metadata)` check or use optional chaining (`metadata?.subject`).

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 193 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeks.length" at line 284 accesses a property of "weeks" without a null/undefined guard. If "weeks" can be null or undefined, this will throw at runtime. Add an `if (weeks)` check or use optional chaining (`weeks?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "months.length" at line 355 accesses a property of "months" without a null/undefined guard. If "months" can be null or undefined, this will throw at runtime. Add an `if (months)` check or use optional chaining (`months?.length`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summarize.run_summarize" may be a semantic duplicate of existing registry operation "commit_story.git.get_commit_data". If these operations are equivalent, reuse "commit_story.git.get_commit_data" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summarize.run_weekly_summarize" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summarize.run_monthly_summarize" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/generators/journal-graph.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "NODE_TEMPERATURES.summary" at line 447 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.summary`).
- CDQ-007 (Attribute Data Quality): setAttribute value "NODE_TEMPERATURES.technical" at line 491 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.technical`).
- CDQ-007 (Attribute Data Quality): setAttribute value "NODE_TEMPERATURES.dialogue" at line 544 accesses a property of "NODE_TEMPERATURES" without a null/undefined guard. If "NODE_TEMPERATURES" can be null or undefined, this will throw at runtime. Add an `if (NODE_TEMPERATURES)` check or use optional chaining (`NODE_TEMPERATURES?.dialogue`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.generate_summary" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.generate_dialogue" may be a semantic duplicate of existing registry operation "commit_story.journal.generate_summary". If these operations are equivalent, reuse "commit_story.journal.generate_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/generators/summary-graph.js**
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_daily_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_monthly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_monthly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_daily" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily_node". If these operations are equivalent, reuse "commit_story.summary.generate_daily_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_weekly_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_weekly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_weekly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_weekly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_weekly_node". If these operations are equivalent, reuse "commit_story.summary.generate_weekly_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_monthly_node" may be a semantic duplicate of existing registry operation "commit_story.summarize.run_monthly_summarize". If these operations are equivalent, reuse "commit_story.summarize.run_monthly_summarize" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_monthly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_monthly_node". If these operations are equivalent, reuse "commit_story.summary.generate_monthly_node" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "commitData.message" at line 45 accesses a property of "commitData" without a null/undefined guard. If "commitData" can be null or undefined, this will throw at runtime. Add an `if (commitData)` check or use optional chaining (`commitData?.message`).
- CDQ-007 (Attribute Data Quality): setAttribute value "filterStats.total" at line 64 accesses a property of "filterStats" without a null/undefined guard. If "filterStats" can be null or undefined, this will throw at runtime. Add an `if (filterStats)` check or use optional chaining (`filterStats?.total`).
- CDQ-007 (Attribute Data Quality): setAttribute value "filterStats.preserved" at line 65 accesses a property of "filterStats" without a null/undefined guard. If "filterStats" can be null or undefined, this will throw at runtime. Add an `if (filterStats)` check or use optional chaining (`filterStats?.preserved`).
- CDQ-007 (Attribute Data Quality): setAttribute value "filteredMessages.length" at line 70 accesses a property of "filteredMessages" without a null/undefined guard. If "filteredMessages" can be null or undefined, this will throw at runtime. Add an `if (filteredMessages)` check or use optional chaining (`filteredMessages?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "filteredSessions.size" at line 71 accesses a property of "filteredSessions" without a null/undefined guard. If "filteredSessions" can be null or undefined, this will throw at runtime. Add an `if (filteredSessions)` check or use optional chaining (`filteredSessions?.size`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.context.gather_context_for_commit" may be a semantic duplicate of existing registry operation "commit_story.context.collect_chat_messages". If these operations are equivalent, reuse "commit_story.context.collect_chat_messages" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarizedDays.length" at line 29 accesses a property of "unsummarizedDays" without a null/undefined guard. If "unsummarizedDays" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedDays)` check or use optional chaining (`unsummarizedDays?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarizedWeeks.length" at line 122 accesses a property of "unsummarizedWeeks" without a null/undefined guard. If "unsummarizedWeeks" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedWeeks)` check or use optional chaining (`unsummarizedWeeks?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarizedMonths.length" at line 185 accesses a property of "unsummarizedMonths" without a null/undefined guard. If "unsummarizedMonths" can be null or undefined, this will throw at runtime. Add an `if (unsummarizedMonths)` check or use optional chaining (`unsummarizedMonths?.length`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summarize.trigger_auto_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summarize.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.summarize.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summarize.trigger_auto_monthly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summarize.trigger_auto_summaries". If these operations are equivalent, reuse "commit_story.summarize.trigger_auto_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/managers/journal-manager.js**
- CDQ-006 (isRecording Guard): setAttribute value "new Date(commit.timestamp).toISOString()..." at line 183 has an expensive computation without span.isRecording() guard. Wrap expensive attribute computations in an if (span.isRecording()) check to avoid unnecessary computation when the span is not being sampled.
- CDQ-007 (Attribute Data Quality): setAttribute value "commit.shortHash" at line 184 accesses a property of "commit" without a null/undefined guard. If "commit" can be null or undefined, this will throw at runtime. Add an `if (commit)` check or use optional chaining (`commit?.shortHash`).
- CDQ-007 (Attribute Data Quality): setAttribute value "entryPath" at line 225 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- CDQ-007 (Attribute Data Quality): setAttribute value "reflections.length" at line 410 accesses a property of "reflections" without a null/undefined guard. If "reflections" can be null or undefined, this will throw at runtime. Add an `if (reflections)` check or use optional chaining (`reflections?.length`).

**src/managers/summary-manager.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "entries.length" at line 52 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "entries.length" at line 163 accesses a property of "entries" without a null/undefined guard. If "entries" can be null or undefined, this will throw at runtime. Add an `if (entries)` check or use optional chaining (`entries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "summaries.length" at line 263 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dailySummaries.length" at line 373 accesses a property of "dailySummaries" without a null/undefined guard. If "dailySummaries" can be null or undefined, this will throw at runtime. Add an `if (dailySummaries)` check or use optional chaining (`dailySummaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "summaries.length" at line 480 accesses a property of "summaries" without a null/undefined guard. If "summaries" can be null or undefined, this will throw at runtime. Add an `if (summaries)` check or use optional chaining (`summaries?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "weeklySummaries.length" at line 593 accesses a property of "weeklySummaries" without a null/undefined guard. If "weeklySummaries" can be null or undefined, this will throw at runtime. Add an `if (weeklySummaries)` check or use optional chaining (`weeklySummaries?.length`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.read_day_entries" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily". If these operations are equivalent, reuse "commit_story.summary.generate_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.save_daily_summary" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_daily". If these operations are equivalent, reuse "commit_story.summary.generate_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_and_save_daily" may be a semantic duplicate of existing registry operation "commit_story.summary.save_daily_summary". If these operations are equivalent, reuse "commit_story.summary.save_daily_summary" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.read_week_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_weekly". If these operations are equivalent, reuse "commit_story.summary.generate_weekly" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.save_weekly_summary" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_and_save_daily". If these operations are equivalent, reuse "commit_story.summary.generate_and_save_daily" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_and_save_weekly" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.read_month_weekly_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.read_week_daily_summaries". If these operations are equivalent, reuse "commit_story.summary.read_week_daily_summaries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.generate_and_save_monthly" may be a semantic duplicate of existing registry operation "commit_story.summary.generate_monthly". If these operations are equivalent, reuse "commit_story.summary.generate_monthly" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/mcp/tools/context-capture-tool.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "filePath" at line 85 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.context.save_context" may be a semantic duplicate of existing registry operation "commit_story.context.gather_context_for_commit". If these operations are equivalent, reuse "commit_story.context.gather_context_for_commit" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): "saveReflection" (async function) at line 65 has no span. Async functions and await expressions require spans for latency tracking and error visibility. Add a span wrapping this function's body.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "filePath" at line 94 appears to be a filesystem path. Absolute paths are high-cardinality and expose developer environment details. Use a relative path or a derived attribute (e.g., basename) instead.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.journal.ensure_directory" may be a semantic duplicate. If these operations are equivalent, reuse "the existing name" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 94 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "result.length" at line 152 accesses a property of "result" without a null/undefined guard. If "result" can be null or undefined, this will throw at runtime. Add an `if (result)` check or use optional chaining (`result?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "dates.length" at line 214 accesses a property of "dates" without a null/undefined guard. If "dates" can be null or undefined, this will throw at runtime. Add an `if (dates)` check or use optional chaining (`dates?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarized.length" at line 260 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- CDQ-007 (Attribute Data Quality): setAttribute value "unsummarized.length" at line 373 accesses a property of "unsummarized" without a null/undefined guard. If "unsummarized" can be null or undefined, this will throw at runtime. Add an `if (unsummarized)` check or use optional chaining (`unsummarized?.length`).
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.find_unsummarized_days" may be a semantic duplicate of existing registry operation "commit_story.summary.get_days_with_entries". If these operations are equivalent, reuse "commit_story.summary.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.get_days_with_daily_summaries" may be a semantic duplicate of existing registry operation "commit_story.summary.get_days_with_entries". If these operations are equivalent, reuse "commit_story.summary.get_days_with_entries" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.find_unsummarized_weeks" may be a semantic duplicate of existing registry operation "commit_story.summary.find_unsummarized_days". If these operations are equivalent, reuse "commit_story.summary.find_unsummarized_days" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.
- SCH-001 (Span Names Match Registry): declared span extension "commit_story.summary.find_unsummarized_months" may be a semantic duplicate of existing registry operation "commit_story.summary.find_unsummarized_weeks". If these operations are equivalent, reuse "commit_story.summary.find_unsummarized_weeks" instead of declaring a new extension. If they are a different operation class, this advisory can be ignored.

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
| **Cost** | $70.20 | $6.44 |
| **Input tokens** | 3,000,000 | 93,471 |
| **Output tokens** | — | 325,603 |
| **Cache read tokens** | — | 173,610 |
| **Cache write tokens** | — | 325,909 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

OK (no spans received — live-check did not validate any telemetry)

## Agent Version

`1.0.0`