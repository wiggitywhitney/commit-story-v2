# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 7.5K
- **Output tokens**: 31.3K
- **Cached tokens**: 20.9K

## Schema Extensions
- `span.commit_story.summary.daily_node`
- `span.commit_story.summary.generate_daily`
- `span.commit_story.summary.weekly_node`
- `span.commit_story.summary.generate_weekly`
- `span.commit_story.summary.monthly_node`
- `span.commit_story.summary.generate_monthly`
- `commit_story.summary.entries_count`
- `commit_story.summary.week_label`
- `commit_story.summary.month_label`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- All six schema spans matching this file's operations (commit_story.journal.generate_summary, generate_technical, generate_dialogue, generate_sections) were already declared by earlier files in this run, so new names under the commit_story.summary.* category were invented for all six entry points (SCH-001: no exact schema match available after prior allocations).
- commit_story.summary.entries_count is a new extension attribute (int) representing the count of input items being processed (journal entries for daily, daily summaries for weekly, weekly summaries for monthly). The registered key commit_story.context.messages_count is described as 'Total number of messages collected from sessions' — semantically distinct from journal entries or summary objects being processed.
- commit_story.summary.week_label is a new extension attribute (string) for the ISO week label parameter (e.g., '2026-W09'). No registered key captures a week identifier; commit_story.journal.entry_date is specifically YYYY-MM-DD and does not accommodate ISO week strings.
- commit_story.summary.month_label is a new extension attribute (string) for the month label parameter (e.g., '2026-02'). Same reasoning as week_label — commit_story.journal.entry_date does not accommodate month-only strings.
- The inner try/catch blocks in dailySummaryNode, weeklySummaryNode, and monthlySummaryNode are graceful-degradation catches — they return error-state objects without rethrowing. These are preserved without recordException/setStatus per NDS-007. The outer span-level catch handles truly unexpected errors and records them per COV-003.
- getModel, resetModel, formatEntriesForSummary, parseSummarySections, cleanDailySummaryOutput, buildGraph, getGraph, formatDailySummariesForWeekly, parseWeeklySummarySections, cleanWeeklySummaryOutput, buildWeeklyGraph, getWeeklyGraph, formatWeeklySummariesForMonthly, parseMonthlySummarySections, cleanMonthlySummaryOutput, buildMonthlyGraph, getMonthlyGraph are all pure synchronous helpers with no async I/O — skipped per RST-001.
- LangChain model.invoke() calls and graph.invoke() calls are covered by @traceloop/instrumentation-langchain, which instruments @langchain/* packages including @langchain/anthropic and @langchain/langgraph model and chain invocations (COV-006).

## Advisory Findings
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
- SCH-001 (Span Names Match Registry): SCH-001 (Span Names Match Registry) fired because a span name doesn't match your Weaver registry or doesn't follow the required dotted-notation format (e.g. myapp.user.create). Use the registry name or declare a new span as a schemaExtension.
