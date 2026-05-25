## Summary

- **Files processed**: 30
- **Committed**: 10
- **No changes needed**: 17
- **Partial**: 3

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | partial (5/5 functions) | 1 | 3 | $0.56 | — | `span.commit_story.context.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 3 | $0.71 | — | `span.commit_story.context.get_previous_commit_time`, `span.commit_story.git.get_commit_data` |
| src/generators/journal-graph.js | success | 4 | 2 | $0.68 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.generate_summary`, `span.commit_story.journal.generate_technical`, `span.commit_story.journal.generate_dialogue`, `span.commit_story.journal.generate_sections` |
| src/generators/summary-graph.js | success | 6 | 1 | $0.58 | `@traceloop/instrumentation-langchain` | `span.commit_story.summary.daily_node`, `span.commit_story.summary.generate_daily`, `span.commit_story.summary.weekly_node`, `span.commit_story.summary.generate_weekly`, `span.commit_story.summary.monthly_node`, `span.commit_story.summary.generate_monthly`, `commit_story.summary.entries_count`, `commit_story.summary.week_label`, `commit_story.summary.month_label` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.28 | — | `span.commit_story.context.gather_context_for_commit` |
| src/mcp/server.js | success | 1 | 1 | $0.04 | `@traceloop/instrumentation-mcp` | `span.commit_story.mcp.server_start`, `commit_story.mcp.transport_type` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.20 | — | `span.commit_story.journal.ensure_directory` |
| src/managers/journal-manager.js | success | 2 | 1 | $0.45 | — | `span.commit_story.journal.save_entry`, `span.commit_story.journal.discover_reflections` |
| src/managers/summary-manager.js | partial (11/14 functions) | 6 | 2 | $1.81 | — | `span.commit_story.journal.read_day_entries`, `commit_story.journal.entries_count`, `span.commit_story.summary.save_daily`, `span.commit_story.summary.read_week_dailies`, `span.commit_story.summary.save_weekly`, `span.commit_story.summary.read_month_weeklies`, `span.commit_story.summary.save_monthly` |
| src/commands/summarize.js | success | 3 | 3 | $1.40 | — | `span.commit_story.summary.run_summarize`, `span.commit_story.summary.run_weekly_summarize`, `commit_story.summary.weeks_count`, `commit_story.summary.generated_count`, `commit_story.summary.failed_count`, `span.commit_story.summary.run_monthly_summarize`, `commit_story.summary.months_count` |
| src/utils/summary-detector.js | success | 9 | 1 | $0.36 | — | `span.commit_story.summary.get_days_with_entries`, `span.commit_story.summary.get_summarized_days`, `span.commit_story.summary.find_unsummarized_days`, `span.commit_story.summary.get_summarized_weeks`, `span.commit_story.summary.get_days_with_daily_summaries`, `span.commit_story.summary.find_unsummarized_weeks`, `span.commit_story.summary.get_summarized_months`, `span.commit_story.summary.get_weeks_with_weekly_summaries`, `span.commit_story.summary.find_unsummarized_months`, `commit_story.summary.unsummarized_days_count`, `commit_story.summary.unsummarized_weeks_count`, `commit_story.summary.unsummarized_months_count` |
| src/managers/auto-summarize.js | partial (2/3 functions) | 2 | 3 | $1.12 | — | `span.commit_story.summary.trigger_auto_weekly_summaries`, `span.commit_story.summary.trigger_auto_monthly_summaries` |
| src/index.js | success | 1 | 1 | $0.41 | — | `span.commit_story.cli.main`, `commit_story.cli.subcommand` |

**No changes needed** (17 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/mcp/tools/context-capture-tool.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/generators/journal-graph.js | 0 | 0 | 4 | 19 |
| src/generators/summary-graph.js | 0 | 0 | 6 | 23 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 13 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/utils/summary-detector.js | 0 | 0 | 5 | 11 |
| src/index.js | 0 | 0 | 1 | 9 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.cli.subcommand
- commit_story.journal.entries_count
- commit_story.mcp.transport_type
- commit_story.summary.entries_count
- commit_story.summary.failed_count
- commit_story.summary.generated_count
- commit_story.summary.month_label
- commit_story.summary.months_count
- commit_story.summary.unsummarized_days_count
- commit_story.summary.unsummarized_months_count
- commit_story.summary.unsummarized_weeks_count
- commit_story.summary.week_label
- commit_story.summary.weeks_count




### New Span IDs (39)

- `span.commit_story.cli.main`
- `span.commit_story.context.collect_chat_messages`
- `span.commit_story.context.gather_context_for_commit`
- `span.commit_story.context.get_previous_commit_time`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.generate_dialogue`
- `span.commit_story.journal.generate_sections`
- `span.commit_story.journal.generate_summary`
- `span.commit_story.journal.generate_technical`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.save_entry`
- `span.commit_story.mcp.server_start`
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.find_unsummarized_days`
- `span.commit_story.summary.find_unsummarized_months`
- `span.commit_story.summary.find_unsummarized_weeks`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.generate_monthly`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.get_days_with_daily_summaries`
- `span.commit_story.summary.get_days_with_entries`
- `span.commit_story.summary.get_summarized_days`
- `span.commit_story.summary.get_summarized_months`
- `span.commit_story.summary.get_summarized_weeks`
- `span.commit_story.summary.get_weeks_with_weekly_summaries`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.read_month_weeklies`
- `span.commit_story.summary.read_week_dailies`
- `span.commit_story.summary.run_monthly_summarize`
- `span.commit_story.summary.run_summarize`
- `span.commit_story.summary.run_weekly_summarize`
- `span.commit_story.summary.save_daily`
- `span.commit_story.summary.save_monthly`
- `span.commit_story.summary.save_weekly`
- `span.commit_story.summary.trigger_auto_monthly_summaries`
- `span.commit_story.summary.trigger_auto_weekly_summaries`
- `span.commit_story.summary.weekly_node`

## Review Attention

- **src/utils/summary-detector.js**: 9 spans added (average: 3) — outlier, review recommended

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.

**src/collectors/git-collector.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/generators/journal-graph.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/generators/summary-graph.js**
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/mcp/tools/context-capture-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/journal-manager.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/summary-manager.js**
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-006 (isRecording Guard): CDQ-006 (isRecording Guard) fired because span.setAttribute() is called with an expensive computation (map, reduce, filter, JSON.stringify, etc.) and no span.isRecording() guard. When sampling drops the span, that computation still runs on every request. Wrap the call in `if (span.isRecording()) { ... }` to skip it when the span won't be exported. Skip this finding for root spans at entry points — the guard adds clutter for negligible gain there.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.

**src/commands/summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.

**src/utils/summary-detector.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.

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
| **Cost** | $70.20 | $8.83 |
| **Input tokens** | 3,000,000 | 250,810 |
| **Output tokens** | — | 360,582 |
| **Cache read tokens** | — | 644,153 |
| **Cache write tokens** | — | 660,203 |

Model: `claude-sonnet-4-6` | Files: 30 | Total file size: 207,197 bytes

## Live-Check Compliance

Live-Check: OK (523 spans, 4170 advisory findings — see compliance report)

Full compliance report: `spiny-orb-live-check-report.json`

## Agent Version

`1.0.0`