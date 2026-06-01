## Summary

- **Files processed**: 30
- **Committed**: 12
- **No changes needed**: 17
- **Failed**: 1

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 3 | $0.50 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 3 | $0.90 | — | `span.commit_story.git.get_previous_commit_time`, `span.commit_story.git.get_commit_data` |
| src/generators/journal-graph.js | success | 4 | 2 | $1.44 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.summary_node`, `span.commit_story.ai.technical_node`, `span.commit_story.ai.dialogue_node`, `span.commit_story.ai.generate_journal_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $1.26 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.daily_summary_node`, `commit_story.journal.entries_count`, `span.commit_story.ai.generate_daily_summary`, `span.commit_story.ai.weekly_summary_node`, `commit_story.journal.week_label`, `span.commit_story.ai.generate_weekly_summary`, `span.commit_story.ai.monthly_summary_node`, `commit_story.journal.month_label`, `span.commit_story.ai.generate_monthly_summary` |
| src/integrators/context-integrator.js | success | 1 | 3 | $0.60 | — | `span.commit_story.context.gather_context_for_commit` |
| src/mcp/server.js | failed: Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×21) at NDS-003:1, NDS-003:10, NDS-003:11, NDS-003:12, NDS-003:13, NDS-003:14, NDS-003:15, NDS-003:16, NDS-003:17, NDS-003:18, NDS-003:19, NDS-003:20, NDS-003:3, NDS-003:37, NDS-003:39, NDS-003:4, NDS-003:5, NDS-003:6, NDS-003:7, NDS-003:8, NDS-003:9 | 0 | 3 | $0.25 | — | — |
| src/utils/journal-paths.js | success | 1 | 1 | $0.20 | — | `span.commit_story.journal.ensure_directory` |
| src/managers/journal-manager.js | success | 2 | 3 | $1.08 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | success | 9 | 1 | $0.62 | — | `span.commit_story.summary.read_day_entries`, `span.commit_story.summary.save_daily_summary`, `span.commit_story.summary.generate_and_save_daily_summary`, `span.commit_story.summary.read_week_daily_summaries`, `span.commit_story.summary.save_weekly_summary`, `span.commit_story.summary.generate_and_save_weekly_summary`, `span.commit_story.summary.read_month_weekly_summaries`, `span.commit_story.summary.save_monthly_summary`, `span.commit_story.summary.generate_and_save_monthly_summary` |
| src/commands/summarize.js | success | 3 | 2 | $0.56 | — | `span.commit_story.commands.run_summarize`, `span.commit_story.commands.run_weekly_summarize`, `span.commit_story.commands.run_monthly_summarize`, `commit_story.summary.dates_count`, `commit_story.summary.force`, `commit_story.summary.generated_count`, `commit_story.summary.weeks_count` |
| src/utils/summary-detector.js | success | 9 | 1 | $0.34 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.get_summarized_days`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_summarized_weeks`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `span.commit_story.summary.get_summarized_months`, `span.commit_story.summary.get_weeks_with_weekly_summaries`, `span.commit_story.summary.find_unsummarized_months`, `commit_story.summary.months_count` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.21 | — | `span.commit_story.auto_summarize.trigger_daily`, `span.commit_story.auto_summarize.trigger_weekly`, `span.commit_story.auto_summarize.trigger_monthly` |
| src/index.js | success | 1 | 3 | $0.93 | — | `span.commit_story.commands.main` |

**No changes needed** (17 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/managers/summary-manager.js | 0 | 0 | 9 | 14 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 |
| src/utils/summary-detector.js | 0 | 0 | 9 | 11 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/index.js | 0 | 0 | 1 | 9 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.journal.entries_count
- commit_story.journal.month_label
- commit_story.journal.week_label
- commit_story.summary.dates_count
- commit_story.summary.force
- commit_story.summary.generated_count
- commit_story.summary.months_count
- commit_story.summary.weeks_count




### New Span IDs (42)

- `span.commit_story.ai.daily_summary_node`
- `span.commit_story.ai.dialogue_node`
- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.generate_journal_sections`
- `span.commit_story.ai.generate_monthly_summary`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.ai.monthly_summary_node`
- `span.commit_story.ai.summary_node`
- `span.commit_story.ai.technical_node`
- `span.commit_story.ai.weekly_summary_node`
- `span.commit_story.auto_summarize.trigger_daily`
- `span.commit_story.auto_summarize.trigger_monthly`
- `span.commit_story.auto_summarize.trigger_weekly`
- `span.commit_story.commands.main`
- `span.commit_story.commands.run_monthly_summarize`
- `span.commit_story.commands.run_summarize`
- `span.commit_story.commands.run_weekly_summarize`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context_for_commit`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.save_entry`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_and_save_daily_summary`
- `span.commit_story.summary.generate_and_save_monthly_summary`
- `span.commit_story.summary.generate_and_save_weekly_summary`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.get_summarized_days`
- `span.commit_story.summary.get_summarized_months`
- `span.commit_story.summary.get_summarized_weeks`
- `span.commit_story.summary.get_weeks_with_weekly_summaries`
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.save_weekly_summary`

## Review Attention

- **src/managers/summary-manager.js**: 9 spans added (average: 4) — outlier, review recommended
- **src/utils/summary-detector.js**: 9 spans added (average: 4) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/collectors/git-collector.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/generators/journal-graph.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/generators/summary-graph.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/integrators/context-integrator.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/mcp/tools/context-capture-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) or an external source string (value fetched from git output, an API response, file contents, or any source whose length is unbounded) and no span.isRecording() guard. When sampling drops the span, that work still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-010 (String Method Type Safety): CDQ-010 (String Method Type Safety) fired because a string-only method (.split(), .trim(), .replace(), etc.) is called directly on a property access like `obj.field.method()`. If `obj.field` isn't a string at runtime, this throws a TypeError. Either coerce with `String(obj.field).method()` or confirm the field is always a string from the surrounding code context.

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
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/commands/summarize.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/utils/summary-detector.js**
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
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

## Agent Notes

Each instrumented file has a companion `.instrumentation.md` file in the same directory (e.g., `src/api.js` → `src/api.instrumentation.md`) containing the agent's full decision notes.

## Recommended Companion Packages

This project was detected as a library. The following auto-instrumentation packages were identified but not added as dependencies — they are SDK-level concerns that deployers should add to their application's telemetry setup.

- `@traceloop/instrumentation-langchain`

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
| **Cost** | $70.20 | $9.08 |
| **Input tokens** | 3,000,000 | 272,215 |
| **Output tokens** | — | 357,948 |
| **Cache read tokens** | — | 388,883 |
| **Cache write tokens** | — | 741,433 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

Live-Check: OK (603 spans, 4165 advisory findings — see compliance report)

Full compliance report: `spiny-orb-live-check-report.json`

## Agent Version

`1.0.0`

## Warnings

- File failed: /Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js — Oscillation detected during fresh regeneration: Duplicate errors across consecutive attempts: NDS-003 (×21) at NDS-003:1, NDS-003:10, NDS-003:11, NDS-003:12, NDS-003:13, NDS-003:14, NDS-003:15, NDS-003:16, NDS-003:17, NDS-003:18, NDS-003:19, NDS-003:20, NDS-003:3, NDS-003:37, NDS-003:39, NDS-003:4, NDS-003:5, NDS-003:6, NDS-003:7, NDS-003:8, NDS-003:9
- Live-check partial: 1 file(s) failed instrumentation (/Users/whitney.lee/Documents/Repositories/commit-story-v2/src/mcp/server.js). Compliance report may be incomplete — spans from failed files are missing. This warning is advisory — the run completed; successfully instrumented files are unaffected. To get full coverage, review the failed files above and re-run spiny-orb on them.