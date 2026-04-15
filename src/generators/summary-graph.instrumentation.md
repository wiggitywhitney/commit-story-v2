# Instrumentation Report: src/generators/summary-graph.js

## Summary
- **Status**: success
- **Spans added**: 6
- **Attempts**: 1 (initial-generation)
- **Input tokens**: 6.4K
- **Output tokens**: 18.9K
- **Cached tokens**: 18.9K

## Schema Extensions
- `span.commit_story.summary.daily_summary_node`
- `span.commit_story.summary.generate_daily_summary`
- `span.commit_story.summary.weekly_summary_node`
- `span.commit_story.summary.generate_weekly_summary`
- `span.commit_story.summary.monthly_summary_node`
- `span.commit_story.summary.generate_monthly_summary`

## Validation Journey
1. **Attempt 1**: 0 errors

## Notes
- Six of 23 functions are instrumented (~26%), slightly above the 20% ratio backstop. All six are high-value targets: three are exported async LangGraph node functions that make LLM API calls (dailySummaryNode, weeklySummaryNode, monthlySummaryNode), and three are the public entry points that invoke the compiled graphs (generateDailySummary, generateWeeklySummary, generateMonthlySummary). Instrumenting both layers gives visibility into orchestration latency vs. LLM call latency.
- The existing try/catch blocks inside dailySummaryNode, weeklySummaryNode, and monthlySummaryNode do not re-throw — they return degraded error state objects. These are real LLM failures, not expected control-flow conditions, so span.recordException and SpanStatusCode.ERROR were added at the top of each catch block. An outer try/finally wraps the full function body to ensure span.end() is always called regardless of which return path is taken (early exit, success, or error).
- All six new span names are schema extensions because the schema already claims the closely related names commit_story.summarize.run_daily/weekly/monthly and commit_story.ai.generate_summary in other files. The new names use the commit_story.summary.* category to distinguish this file's graph-node and graph-invoke level operations without colliding with already-declared span names.
- getModel, resetModel, formatEntriesForSummary, formatDailySummariesForWeekly, formatWeeklySummariesForMonthly, cleanDailySummaryOutput, cleanWeeklySummaryOutput, cleanMonthlySummaryOutput are all pure synchronous helpers with no I/O — they are skipped (RST-001: no spans on synchronous utilities). The unexported buildGraph/buildWeeklyGraph/buildMonthlyGraph, getGraph/getWeeklyGraph/getMonthlyGraph, and all parse*Sections functions are also skipped (RST-004: unexported internal functions).
- LangChainInstrumentation from @traceloop/instrumentation-langchain covers the model.invoke() calls inside each node at the framework level. The manual spans on the node functions and generate* entry points form parent spans so that auto-instrumented LLM call spans appear as children, giving a complete view of orchestration overhead plus model latency.
