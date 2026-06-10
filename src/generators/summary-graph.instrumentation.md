# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 2 (multi-turn-fix)
- **Input tokens**: 45.1K
- **Output tokens**: 35.8K

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

## Validation Journey
1. **Attempt 1**: 3 blocking errors (SCH-002 (Attribute Keys Match Registry):3)
2. **Attempt 2**: 0 errors

## Notes
- SCH-002 fix: replaced commit_story.journal.weekly_summaries_count with the registered commit_story.journal.daily_summaries_count in monthlySummaryNode and generateMonthlySummary. The validator identified these as semantic duplicates — both capture a count of summary documents being aggregated into a higher-level summary. The registered key is reused for the monthly node's input count of weekly summaries.
- dailySummaryNode, weeklySummaryNode, and monthlySummaryNode each have an inner try/catch that returns a graceful-degradation result on LLM failure without rethrowing — these inner catches receive no recordException/setStatus per NDS-007. The outer span-level catch records unexpected errors that escape the inner catch.
- getModel, resetModel, formatEntriesForSummary, parseSummarySections, cleanDailySummaryOutput, formatDailySummariesForWeekly, parseWeeklySummarySections, cleanWeeklySummaryOutput, formatWeeklySummariesForMonthly, parseMonthlySummarySections, cleanMonthlySummaryOutput are all pure synchronous helpers with no I/O — skipped per RST-001.
- buildGraph, getGraph, buildWeeklyGraph, getWeeklyGraph, buildMonthlyGraph, getMonthlyGraph are synchronous unexported utilities — skipped per RST-001 and RST-004.
- SCH-001 advisories: daily_summary_node, generate_daily_summary, weekly_summary_node, generate_weekly_summary, monthly_summary_node, generate_monthly_summary are each distinct operation classes from each other and from the previously registered generate_summary span. daily_summary_node is the LangGraph node function that performs LLM inference; generate_daily_summary is the public orchestrator that invokes the compiled graph. These are structurally and semantically different operations and warrant separate span names.
- commit_story.journal.entries_count (int): no registered key captures the count of journal entry documents being summarized. commit_story.context.messages_count counts Claude Code session messages, which is semantically different.
- commit_story.journal.week_label (string): no registered key captures an ISO week identifier string. commit_story.journal.entry_date only captures YYYY-MM-DD daily dates.
- commit_story.journal.month_label (string): no registered key captures a month identifier string such as '2026-02'.
- @langchain/langgraph graph.invoke() and @langchain/anthropic getModel().invoke() calls are covered by LangChainInstrumentation and AnthropicInstrumentation respectively — no manual spans added for those calls per COV-006.

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
