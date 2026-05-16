# Instrumentation Report: src/managers/summary-manager.js

## Summary
- **Status**: success
- **Spans added**: 9
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 43.5K
- **Output tokens**: 29.8K

## Schema Extensions
- `span.commit_story.summary.read_day_entries`
- `span.commit_story.summary.save_daily_summary`
- `span.commit_story.summary.generate_and_save_daily`
- `span.commit_story.summary.read_week_daily_summaries`
- `span.commit_story.summary.save_weekly_summary`
- `span.commit_story.summary.generate_and_save_weekly`
- `span.commit_story.summary.read_month_weekly_summaries`
- `span.commit_story.summary.save_monthly_summary`
- `span.commit_story.summary.generate_and_save_monthly`
- `commit_story.summary.entry_count`
- `commit_story.summary.week_label`
- `commit_story.summary.day_count`
- `commit_story.summary.month_label`
- `commit_story.summary.week_count`

## Validation Journey
1. **Attempt 1**: 55 blocking errors (NDS-003 (Code Preserved):55)
2. **Attempt 2**: 0 errors

## Notes
- formatDailySummary, formatWeeklySummary, formatMonthlySummary are pure synchronous functions with no I/O — skipped (RST-001).
- getWeekBoundaries and getMonthBoundaries are pure synchronous date-math helpers with no I/O — skipped (RST-001).
- commit_story.summary.entry_count: no registered key counts journal entry segments split from a day file. commit_story.context.messages_count counts Claude Code session messages, which is semantically different.
- commit_story.summary.week_label: no registered key represents an ISO week string (e.g. '2026-W09'). commit_story.journal.entry_date is YYYY-MM-DD only and does not accommodate ISO week notation.
- commit_story.summary.day_count: no registered key counts daily summaries found within a week. commit_story.context.sessions_count counts Claude Code sessions, not daily summary files.
- commit_story.summary.month_label: no registered key represents a month period string (e.g. '2026-02'). commit_story.journal.entry_date is a specific date, not a month identifier.
- commit_story.summary.week_count: no registered key counts weekly summaries found within a month. Distinct from any session or message count in the registry.
- CDQ-007 advisories on .length values: entries, summaries, dailySummaries, and weeklySummaries are always initialized as array literals or returned from functions that always return arrays — they are never null or undefined, so null guards are not needed per the constraint against unnecessary guards on always-defined values.
- CDQ-007 advisories on file path attributes: basename is not imported in this file (only join from node:path is available). Per CDQ-007 rules, the raw path value is used and this is noted as a known limitation. Adding a new non-OTel import to satisfy the advisory is prohibited.
- SCH-001 advisories: all nine span names represent distinct operations (read vs save vs generate-and-save, daily vs weekly vs monthly) and are not semantic duplicates of each other despite sharing the commit_story.summary prefix.
- The multi-line import for summary-graph.js and the multi-line function signatures for saveDailySummary, generateAndSaveDailySummary, saveWeeklySummary, generateAndSaveWeeklySummary, saveMonthlySummary, and generateAndSaveMonthlySummary were restored to their original multi-line forms to fix NDS-003 failures from the previous instrumentation pass.

## Advisory Findings
- CDQ-007 (Attribute Data Quality):37: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):56: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):113: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):187: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):274: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):333: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):415: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):509: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):571: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- CDQ-007 (Attribute Data Quality):653: CDQ-007 (Attribute Data Quality) fired for one or more of: a PII attribute name (like author, email, or username), a raw filesystem path where a basename would be safer, or a property access used as an attribute value without a null check. PII in traces can violate privacy policies and is worth fixing. The path and null-guard findings are lower severity — fix them if the code will run in a context where the value might be null.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
