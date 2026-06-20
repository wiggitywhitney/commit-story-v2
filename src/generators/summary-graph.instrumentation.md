# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 8.2K
- **Output tokens**: 26.8K
- **Cached tokens**: 23.8K

## Schema Extensions
- `span.commit_story.journal.daily_summary_node`
- `span.commit_story.journal.generate_daily_summary`
- `span.commit_story.journal.weekly_summary_node`
- `span.commit_story.journal.generate_weekly_summary`
- `span.commit_story.journal.monthly_summary_node`
- `span.commit_story.journal.generate_monthly_summary`
- `commit_story.journal.entries_count`
- `commit_story.journal.week_label`
- `commit_story.journal.daily_summaries_count`
- `commit_story.journal.month_label`
- `commit_story.journal.weekly_summaries_count`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- dailySummaryNode, weeklySummaryNode, and monthlySummaryNode each have an inner try/catch that returns a graceful degradation value without rethrowing — these inner catches are preserved exactly as-is per NDS-007 (no recordException or setStatus added to them). The outer span-level catch handles any unexpected errors not caught by the inner block.
- commit_story.journal.entries_count (int): no registered key describes the count of journal entries being summarized. commit_story.context.messages_count is for collected session messages, not rendered journal entries passed to a summary node — semantically distinct.
- commit_story.journal.week_label (string): no registered key captures an ISO week identifier (e.g. '2026-W09'). commit_story.journal.entry_date is YYYY-MM-DD and does not represent a week range label.
- commit_story.journal.daily_summaries_count (int): no registered key describes the count of daily summary objects being aggregated into a weekly summary. commit_story.context.sessions_count counts Claude Code sessions, not daily summaries.
- commit_story.journal.month_label (string): no registered key captures a month identifier string (e.g. '2026-02') used to label monthly summary context.
- commit_story.journal.weekly_summaries_count (int): no registered key describes the count of weekly summary objects being aggregated into a monthly summary.
- LangChain (@langchain/langgraph, @langchain/anthropic, @langchain/core) is imported — @traceloop/instrumentation-langchain covers LLM invocation calls as child spans. Manual spans are still added to the application-level node and generate functions as COV-001 service entry points.
- getModel, resetModel, formatEntriesForSummary, parseSummarySections, cleanDailySummaryOutput, buildGraph, getGraph, formatDailySummariesForWeekly, parseWeeklySummarySections, cleanWeeklySummaryOutput, buildWeeklyGraph, getWeeklyGraph, formatWeeklySummariesForMonthly, parseMonthlySummarySections, cleanMonthlySummaryOutput, buildMonthlyGraph, getMonthlyGraph — all skipped: these are synchronous pure helpers or thin graph construction wrappers with no I/O (RST-001/RST-003/RST-004).

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
