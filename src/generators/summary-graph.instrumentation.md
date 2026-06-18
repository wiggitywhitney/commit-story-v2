# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.0K
- **Output tokens**: 31.2K
- **Cached tokens**: 23.2K

## Schema Extensions
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.weekly_summary_node`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.generate_monthly_summary`
- `commit_story.journal.entries_count`
- `commit_story.journal.week_label`
- `commit_story.journal.month_label`
- `commit_story.journal.summaries_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- commit_story.journal.entries_count (type: int, stability: development): Captures the number of journal entries passed into dailySummaryNode and generateDailySummary. No registered key describes 'count of journal entries being summarized' — commit_story.context.messages_count is 'messages collected from sessions' which is semantically different. A new extension key is required.
- commit_story.journal.week_label (type: string, stability: development): Captures the ISO week string (e.g., '2026-W09') passed to weeklySummaryNode and generateWeeklySummary. No registered key exists for a week period identifier — commit_story.journal.entry_date is YYYY-MM-DD daily granularity only. A new extension key is required.
- commit_story.journal.month_label (type: string, stability: development): Captures the month string (e.g., '2026-02') passed to monthlySummaryNode and generateMonthlySummary. No registered key exists for a month period identifier. A new extension key is required.
- commit_story.journal.summaries_count (type: int, stability: development): Captures the count of daily or weekly summaries being consolidated. No registered key precisely matches 'count of summaries being processed as input to a higher-level aggregation'. A new extension key is required.
- Inner catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are graceful-degradation catches — they return fallback values without rethrowing. Per NDS-007, recordException and setStatus(ERROR) were NOT added to these inner catches. The outer span-level catch handles any unexpected errors that escape the inner catch.
- LangChain is detected via @langchain/langgraph, @langchain/anthropic, and @langchain/core/messages imports. The LLM API calls (getModel().invoke()) inside the node functions are covered by LangChainInstrumentation auto-instrumentation. Manual spans are still applied to the application-level node and generate functions as COV-001 entry points.
- getModel, resetModel, formatEntriesForSummary, parseSummarySections, cleanDailySummaryOutput, buildGraph, getGraph, formatDailySummariesForWeekly, parseWeeklySummarySections, cleanWeeklySummaryOutput, buildWeeklyGraph, getWeeklyGraph, formatWeeklySummariesForMonthly, parseMonthlySummarySections, cleanMonthlySummaryOutput, buildMonthlyGraph, getMonthlyGraph — all synchronous or thin synchronous wrappers with no async I/O. Skipped per RST-001 (no spans on synchronous utilities) and RST-004 (unexported internal helpers covered by exported orchestrator spans).
- Input attributes (entry_date, entries_count, week_label, month_label, summaries_count) are set before the early-return guards inside each span, using state.entries / state.date etc. directly so they are present on all execution paths including the early-exit path.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
