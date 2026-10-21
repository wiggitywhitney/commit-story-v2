## Summary

- **Files processed**: 32
- **Committed**: 14
- **No changes needed**: 18

## Per-File Results

| File | Status | Spans | Attempts | Cost | Libraries | Schema Extensions |
|------|--------|-------|----------|------|-----------|-------------------|
| src/collectors/claude-collector.js | success | 1 | 1 | $0.19 | — | `span.commit_story.claude.collect_chat_messages` |
| src/collectors/git-collector.js | success | 2 | 3 | $0.76 | — | `span.commit_story.git.get_previous_commit_time`, `span.commit_story.git.get_commit_data` |
| src/integrators/context-integrator.js | success | 1 | 1 | $0.26 | — | `span.commit_story.context.gather_context_for_commit` |
| src/generators/journal-graph.js | success | 4 | 3 | $2.10 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_summary`, `span.commit_story.ai.generate_technical_decisions`, `commit_story.ai.substantial_user_messages`, `span.commit_story.ai.generate_dialogue`, `commit_story.ai.max_quotes`, `span.commit_story.ai.generate_journal_sections` |
| src/generators/summary-graph.js | success | 6 | 2 | $1.79 | `@traceloop/instrumentation-langchain` | `span.commit_story.ai.generate_daily_summary`, `commit_story.journal.entries_count`, `span.commit_story.journal.generate_daily_summary`, `span.commit_story.ai.generate_weekly_summary`, `commit_story.journal.week_label`, `span.commit_story.journal.generate_weekly_summary`, `span.commit_story.ai.generate_monthly_summary`, `commit_story.journal.month_label`, `span.commit_story.journal.generate_monthly_summary` |
| src/mcp/tools/context-capture-tool.js | success | 1 | 1 | $0.16 | — | `span.commit_story.context.save_context` |
| src/mcp/server.js | success | 1 | 1 | $0.05 | `@traceloop/instrumentation-mcp`, `@opentelemetry/instrumentation-pino` | `span.commit_story.mcp.server.start`, `commit_story.mcp.transport` |
| src/utils/journal-paths.js | success | 1 | 1 | $0.22 | — | `span.commit_story.journal.ensure_directory` |
| src/managers/journal-manager.js | success | 2 | 1 | $0.45 | — | `span.commit_story.journal.save_journal_entry`, `span.commit_story.journal.discover_reflections`, `commit_story.journal.reflections_count` |
| src/managers/summary-manager.js | success | 9 | 2 | $1.72 | `@traceloop/instrumentation-langchain` | `span.commit_story.journal.read_day_entries`, `span.commit_story.journal.save_daily_summary`, `span.commit_story.journal.generate_and_save_daily_summary`, `span.commit_story.journal.read_week_daily_summaries`, `span.commit_story.journal.save_weekly_summary`, `span.commit_story.journal.generate_and_save_weekly_summary`, `span.commit_story.journal.read_month_weekly_summaries`, `span.commit_story.journal.save_monthly_summary`, `span.commit_story.journal.generate_and_save_monthly_summary` |
| src/commands/summarize.js | success | 3 | 2 | $0.57 | — | `span.commit_story.commands.run_summarize`, `span.commit_story.commands.run_weekly_summarize`, `span.commit_story.commands.run_monthly_summarize`, `commit_story.summarize.dates_count`, `commit_story.summarize.force`, `commit_story.summarize.failed_count` |
| src/utils/summary-detector.js | success | 5 | 3 | $2.13 | — | `span.commit_story.journal.get_days_with_entries`, `commit_story.journal.base_path`, `span.commit_story.journal.find_unsummarized_days`, `span.commit_story.journal.get_days_with_daily_summaries`, `span.commit_story.journal.find_unsummarized_weeks`, `commit_story.journal.unsummarized_weeks_count`, `span.commit_story.journal.find_unsummarized_months`, `commit_story.journal.unsummarized_months_count` |
| src/managers/auto-summarize.js | success | 3 | 1 | $0.24 | — | `span.commit_story.managers.trigger_auto_summaries`, `span.commit_story.managers.trigger_auto_weekly_summaries`, `span.commit_story.managers.trigger_auto_monthly_summaries` |
| src/index.js | success | 2 | 1 | $0.34 | — | `span.commit_story.commands.handle_summarize`, `span.commit_story.index.main` |

**No changes needed** (18 files, 0 spans): src/generators/prompts/guidelines/accessibility.js, src/generators/prompts/guidelines/anti-hallucination.js, src/generators/prompts/guidelines/index.js, src/generators/prompts/sections/daily-summary-prompt.js, src/generators/prompts/sections/dialogue-prompt.js, src/generators/prompts/sections/monthly-summary-prompt.js, src/generators/prompts/sections/summary-prompt.js, src/generators/prompts/sections/technical-decisions-prompt.js, src/generators/prompts/sections/weekly-summary-prompt.js, src/integrators/filters/message-filter.js, src/integrators/filters/sensitive-filter.js, src/integrators/filters/token-filter.js, src/logger.js, src/mcp/tools/reflection-tool.js, src/traceloop-init.js, src/utils/commit-analyzer.js, src/utils/config.js, src/utils/failure-placeholder.js

## Span Category Breakdown

| File | External Calls | Schema-Defined | Service Entry Points | Total Functions |
|------|---------------|----------------|---------------------|-----------------|
| src/collectors/claude-collector.js | 0 | 0 | 1 | 8 |
| src/integrators/context-integrator.js | 0 | 0 | 1 | 3 |
| src/mcp/tools/context-capture-tool.js | 0 | 0 | 1 | 5 |
| src/mcp/server.js | 0 | 0 | 1 | 2 |
| src/utils/journal-paths.js | 0 | 0 | 1 | 12 |
| src/managers/journal-manager.js | 0 | 0 | 2 | 12 |
| src/commands/summarize.js | 0 | 0 | 3 | 9 |
| src/managers/auto-summarize.js | 0 | 0 | 3 | 4 |
| src/index.js | 0 | 0 | 2 | 8 |

## Schema Changes

# Summary of Schema Changes
## Registry versions
Baseline: 0.1.0

Head: 0.1.0

## Registry Attributes
### Added
- commit_story.ai.max_quotes
- commit_story.ai.substantial_user_messages
- commit_story.journal.base_path
- commit_story.journal.entries_count
- commit_story.journal.month_label
- commit_story.journal.reflections_count
- commit_story.journal.unsummarized_months_count
- commit_story.journal.unsummarized_weeks_count
- commit_story.journal.week_label
- commit_story.mcp.transport
- commit_story.summarize.dates_count
- commit_story.summarize.failed_count
- commit_story.summarize.force




### New Span IDs (41)

- `span.commit_story.ai.generate_daily_summary`
- `span.commit_story.ai.generate_dialogue`
- `span.commit_story.ai.generate_journal_sections`
- `span.commit_story.ai.generate_monthly_summary`
- `span.commit_story.ai.generate_summary`
- `span.commit_story.ai.generate_technical_decisions`
- `span.commit_story.ai.generate_weekly_summary`
- `span.commit_story.claude.collect_chat_messages`
- `span.commit_story.commands.handle_summarize`
- `span.commit_story.commands.run_monthly_summarize`
- `span.commit_story.commands.run_summarize`
- `span.commit_story.commands.run_weekly_summarize`
- `span.commit_story.context.gather_context_for_commit`
- `span.commit_story.context.save_context`
- `span.commit_story.git.get_commit_data`
- `span.commit_story.git.get_previous_commit_time`
- `span.commit_story.index.main`
- `span.commit_story.journal.discover_reflections`
- `span.commit_story.journal.ensure_directory`
- `span.commit_story.journal.find_unsummarized_days`
- `span.commit_story.journal.find_unsummarized_months`
- `span.commit_story.journal.find_unsummarized_weeks`
- `span.commit_story.journal.generate_and_save_daily_summary`
- `span.commit_story.journal.generate_and_save_monthly_summary`
- `span.commit_story.journal.generate_and_save_weekly_summary`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.generate_monthly_summary`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.get_days_with_daily_summaries`
- `span.commit_story.journal.get_days_with_entries`
- `span.commit_story.journal.read_day_entries`
- `span.commit_story.journal.read_month_weekly_summaries`
- `span.commit_story.journal.read_week_daily_summaries`
- `span.commit_story.journal.save_daily_summary`
- `span.commit_story.journal.save_journal_entry`
- `span.commit_story.journal.save_monthly_summary`
- `span.commit_story.journal.save_weekly_summary`
- `span.commit_story.managers.trigger_auto_monthly_summaries`
- `span.commit_story.managers.trigger_auto_summaries`
- `span.commit_story.managers.trigger_auto_weekly_summaries`
- `span.commit_story.mcp.server.start`

## Review Attention

### Advisory Findings

**src/collectors/claude-collector.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/collectors/git-collector.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/integrators/context-integrator.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/generators/journal-graph.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/generators/summary-graph.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/mcp/tools/context-capture-tool.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/mcp/tools/reflection-tool.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.

**src/utils/journal-paths.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/journal-manager.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/summary-manager.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
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

**src/utils/summary-detector.js**
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- COV-004 (Async Operation Spans): COV-004 (Async Operation Spans) fired because this async function doesn't have a span. Without one, traces have a gap here — callers can see time was spent and whether an error occurred, but not what happened inside this function. Add a span unless this is a pure synchronous utility with no I/O (RST-001 exemption) — context propagation covers unexported internal helpers.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/managers/auto-summarize.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

**src/index.js**
- CDQ-007 (Attribute Data Quality): CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username) or a raw filesystem path where a basename would be safer. PII in traces can violate privacy policies and is worth fixing. The path finding is lower severity — fix it when the code will run in a context where the basename utility is already imported.

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
| **Cost** | $74.88 | $11.15 (claude-sonnet-4-6) |
| **Input tokens** | 3,200,000 | 340,259 |
| **Output tokens** | — | 411,127 |
| **Cache read tokens** | — | 671,379 |
| **Cache write tokens** | — | 1,001,622 |

Model: `claude-sonnet-4-6` | Files: 32 | Total file size: 212,098 bytes

## Live-Check Compliance

Live-Check: OK (607 spans, 4966 advisory findings — see compliance report)

Full compliance report: `spiny-orb-live-check-report.json`

## Agent Version

`1.0.0`