## Summary

- **Files processed**: 30
- **Committed**: 12
- **No changes needed**: 16
- **Failed**: 2

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.22 | — | `span.commit_story.claude_collector.collect_chat_messages` |
| src/collectors/git-collector.js | success | 6 | 2 | $0.39 | — | `span.commit_story.git_collector.run_git`, `span.commit_story.git_collector.get_commit_metadata`, `span.commit_story.git_collector.get_commit_diff`, `span.commit_story.git_collector.get_merge_info`, `span.commit_story.git_collector.get_previous_commit_time`, `span.commit_story.git_collector.get_commit_data`, `commit_story.git_collector.is_merge` |
| src/generators/journal-graph.js | success | 4 | 2 | $0.80 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.summary_node`, `span.commit_story.journal.technical_node`, `span.commit_story.journal.dialogue_node`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $0.63 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.daily_summary_node`, `span.commit_story.journal.generate_daily_summary`, `span.commit_story.journal.weekly_summary_node`, `span.commit_story.journal.generate_weekly_summary`, `span.commit_story.journal.monthly_summary_node`, `span.commit_story.journal.generate_monthly_summary`, `commit_story.summary.entries_count`, `commit_story.summary.week_label`, `commit_story.summary.weekly_summaries_count`, `commit_story.summary.month_label` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.25 | — | `span.commit_story.context.gather_context_for_commit` |
| src/mcp/tools/context-capture-tool.js | success | 1 | 1 | $0.16 | `@traceloop/instrumentation-mcp` | `span.commit_story.context.save_context` |
| src/mcp/server.js | failed: Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×5) at NDS-003:2, NDS-003:3, NDS-003:31, NDS-003:33, NDS-003:34 | 0 | 3 | $0.22 | — | — |
| src/utils/journal-paths.js | success | 1 | 1 | $0.22 | — | `span.commit_story.journal.ensure_directory` |
| src/managers/journal-manager.js | success | 2 | 1 | $0.49 | — | `span.commit_story.journal.save_journal_entry`, `span.commit_story.journal.discover_reflections`, `commit_story.journal.reflections_count` |
| src/managers/summary-manager.js | success | 9 | 1 | $0.61 | — | `span.commit_story.summary.read_day_entries`, `span.commit_story.summary.save_daily_summary`, `span.commit_story.summary.generate_and_save_daily_summary`, `span.commit_story.summary.read_week_daily_summaries`, `span.commit_story.summary.save_weekly_summary`, `span.commit_story.summary.generate_and_save_weekly_summary`, `span.commit_story.summary.read_month_weekly_summaries`, `span.commit_story.summary.save_monthly_summary`, `span.commit_story.summary.generate_and_save_monthly_summary` |
| src/commands/summarize.js | success | 3 | 3 | $1.55 | — | `span.commit_story.summary.run_summarize`, `commit_story.summary.dates_count`, `commit_story.summary.force`, `span.commit_story.summary.run_weekly_summarize`, `span.commit_story.summary.run_monthly_summarize` |
| src/utils/summary-detector.js | success | 5 | 2 | $1.39 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `commit_story.summary.unsummarized_weeks_count`, `span.commit_story.summary.find_unsummarized_months`, `commit_story.summary.unsummarized_months_count` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.26 | — | `span.commit_story.summary.trigger_auto_summaries`, `span.commit_story.summary.trigger_auto_weekly_summaries`, `span.commit_story.summary.trigger_auto_monthly_summaries`, `commit_story.summary.generated_count`, `commit_story.summary.failed_count` |
| src/index.js | failed: Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-005 — NDS-003: original line 25 missing/modified: import { The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line. | 0 | 2 | $0.76 | — | — |

**No changes needed** (16 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 |
| src/collectors/git-collector.js | 1 | 0 | 2 | 6 |
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 6 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/managers/summary-manager.js | 0 | 0 | 9 | 14 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.git_collector.is_merge
- commit_story.journal.reflections_count
- commit_story.summary.dates_count
- commit_story.summary.entries_count
- commit_story.summary.failed_count
- commit_story.summary.force
- commit_story.summary.generated_count
- commit_story.summary.month_label
- commit_story.summary.unsummarized_months_count
- commit_story.summary.unsummarized_weeks_count
- commit_story.summary.week_label
- commit_story.summary.weekly_summaries_count




### New Span IDs (42)

- `span.commit_story.claude_collector.collect_chat_messages`
- `span.commit_story.context.gather_context_for_commit`
- `span.commit_story.context.save_context`
- `span.commit_story.git_collector.get_commit_data`
- `span.commit_story.git_collector.get_commit_diff`
- `span.commit_story.git_collector.get_commit_metadata`
- `span.commit_story.git_collector.get_merge_info`
- `span.commit_story.git_collector.get_previous_commit_time`
- `span.commit_story.git_collector.run_git`
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.dialogue_node`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.generate_monthly_summary`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.save_journal_entry`
- `span.commit_story.journal.summary_node`
- `span.commit_story.journal.technical_node`
- `span.commit_story.journal.weekly_summary_node`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_and_save_daily_summary`
- `span.commit_story.summary.generate_and_save_monthly_summary`
- `span.commit_story.summary.generate_and_save_weekly_summary`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.run_monthly_summarize`
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.save_weekly_summary`
- `span.commit_story.summary.trigger_auto_monthly_summaries`
- `span.commit_story.summary.trigger_auto_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`

## Review Attention

- **src/managers/summary-manager.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/collectors/git-collector.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/generators/journal-graph.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/generators/summary-graph.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/mcp/tools/context-capture-tool.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/summary-manager.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/utils/summary-detector.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

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
| **Cost** | $70.20 | $8.10 |
| **Input tokens** | 3,000,000 | 296,489 |
| **Output tokens** | — | 301,972 |
| **Cache read tokens** | — | 396,040 |
| **Cache write tokens** | — | 682,919 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

Live-Check: OK (598 spans, 4495 advisory findings — see compliance report)

Full compliance report: `spiny-orb-live-check-report.json`

## Agent Version

`1.0.0`

## Warnings

- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js — Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×5) at NDS-003:2, NDS-003:3, NDS-003:31, NDS-003:33, NDS-003:34
- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/index.js — Validation failed: NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-003, NDS-005 — NDS-003: original line 25 missing/modified: import {
The agent must preserve all original business logic. Only add instrumentation — do not modify, remove, or reorder existing code. If lines are missing because you joined a multi-line statement or expression onto fewer lines (variable declarations, method chains, function call arguments, conditional expressions, or any other code spanning multiple lines), restore every line to its exact original form — each original line must appear as its own line.
- Live-check partial: 2 file(s) failed instrumentation (/Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js, /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/index.js). Compliance report may be incomplete — spans from failed files are missing. This warning is advisory — the run completed; successfully instrumented files are unaffected. To get full coverage, review the failed files above and re-run spiny-orb on them.